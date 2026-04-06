from grpc import Status
from src.repositories.students import StudentMarkRepository, StudentRepository
from src.models.students import Student
from src.models.master import Programe, ProgramPaymentWorkflowScope, FeeDetails
from src.models.payment import Payment, SemesterFee, PaymentTransaction
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Dict, Optional
from src.schemas.students import StudentCreate, StudentMarkCreate, StudentResponse
from src.core.config import settings
import httpx
from src.services.integrations.student_api import fetch_students_list
import logging
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
import traceback
import re
from datetime import datetime
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)

    def create_student(self, student_data: StudentCreate) -> Student:
        """Create a new student."""
        return self.student_repo.create(student_data)

    def get_student_by_id(self, student_id: int) -> Student:
        """Retrieve a student by ID."""
        return self.student_repo.get_by_id(student_id)
    
    def get_student_id(self, student_id: int) -> Student:
        """Retrieve a student by ID."""
        return self.student_repo.get_student_by_id(student_id)
    
    def get_fees(self, student_id: int) -> Student:
        """Retrieve a student by ID."""
        return self.student_repo.get_fees(student_id)

    def get_pending_payment_status(self, student_id: int) -> dict:
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        workflow_enabled = self._is_workflow_enabled_for_student(student)
        logger.info(
            "Workflow enabled for student %s: %s (semester=%s batch=%s admission_year=%s)",
            student_id,
            workflow_enabled,
            student.semester,
            student.batch,
            student.admission_year,
        )

        return {
            "student_id": student.id,
            "program_id": student.program_id,
            "workflow_enabled": workflow_enabled,
            "pending_payment_due": student.pending_payment_due,
            "pending_payment_amount": float(student.pending_payment_amount or 0.0),
            "pending_payment_link": student.pending_payment_link,
            "message": "Pending payment status fetched successfully",
        }

    def _extract_semester_number(self, semester_value: object) -> Optional[int]:
        if semester_value is None:
            return None

        if isinstance(semester_value, int):
            return semester_value

        semester_str = str(semester_value).strip().lower()
        if not semester_str:
            return None

        match = re.search(r"(\d+)", semester_str)
        if match:
            return int(match.group(1))

        return None

    def _ordinal_semester_label(self, semester_number: int) -> str:
        if 10 <= semester_number % 100 <= 20:
            suffix = "th"
        else:
            suffix = {1: "st", 2: "nd", 3: "rd"}.get(semester_number % 10, "th")
        return f"{semester_number}{suffix}"

    def _semester_candidates(self, semester_value: object) -> List[str]:
        candidates: List[str] = []
        semester_number = self._extract_semester_number(semester_value)

        raw_value = str(semester_value).strip() if semester_value is not None else ""
        if raw_value:
            candidates.append(raw_value)

        if semester_number is not None:
            candidates.extend(
                [
                    str(semester_number),
                    f"semester_{semester_number}",
                    f"Semester {semester_number}",
                    self._ordinal_semester_label(semester_number),
                ]
            )

        deduped: List[str] = []
        seen = set()
        for candidate in candidates:
            if candidate not in seen:
                deduped.append(candidate)
                seen.add(candidate)
        return deduped

    def _get_student_semester_candidates(self, student: Student) -> List[str]:
        # Only use the student's semester string for workflow matching.
        return self._semester_candidates(student.semester)

    def _is_workflow_enabled_for_student(self, student: Student) -> bool:
        program = self.db.query(Programe).filter(Programe.id == student.program_id).first()
        if not program:
            logger.info(
                "Workflow disabled for student %s: program not found (program_id=%s)",
                student.id,
                student.program_id,
            )
            return False

        # Backward compatibility: program-level switch can still force-enable.
        if program.pending_payment_workflow_enabled:
            return True

        semester_candidates = self._get_student_semester_candidates(student)

        if not student.batch or not student.admission_year or not semester_candidates:
            logger.info(
                "Workflow disabled for student %s: missing batch/admission_year/semester (batch=%s admission_year=%s semester=%s)",
                student.id,
                student.batch,
                student.admission_year,
                student.semester,
            )
            return False

        # Case-insensitive semester match
        semester_candidates_lower = [c.lower() for c in semester_candidates]

        logger.info(
            "Workflow scope lookup for student %s => batch=%s, admission_year=%s, semester_candidates=%s",
            student.id,
            student.batch,
            student.admission_year,
            semester_candidates_lower,
        )

        scope = (
            self.db.query(ProgramPaymentWorkflowScope)
            .filter(
                ProgramPaymentWorkflowScope.program_id == student.program_id,
                ProgramPaymentWorkflowScope.batch == student.batch,
                ProgramPaymentWorkflowScope.admission_year == student.admission_year,
                func.lower(ProgramPaymentWorkflowScope.semester).in_(semester_candidates_lower),
                ProgramPaymentWorkflowScope.enabled.is_(True),
            )
            .first()
        )
        if scope:
            logger.info(
                "Matched scope: program_id=%s batch=%s admission_year=%s semester=%s enabled=%s",
                scope.program_id,
                scope.batch,
                scope.admission_year,
                scope.semester,
                scope.enabled,
            )
        else:
            logger.info(
                "No matching scope found for student %s with batch=%s, admission_year=%s, semester_candidates=%s",
                student.id,
                student.batch,
                student.admission_year,
                semester_candidates_lower,
            )
        return bool(scope)

    def assign_pending_payment(self, student_id: int, payment_link: str, amount: float) -> dict:
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        if not self._is_workflow_enabled_for_student(student):
            raise HTTPException(
                status_code=400,
                detail="Pending payment workflow is disabled for this student's program/batch/year/semester",
            )

        student.pending_payment_due = True
        student.pending_payment_amount = amount
        student.pending_payment_link = payment_link

        self.db.commit()
        self.db.refresh(student)
        return self.get_pending_payment_status(student_id)

    def complete_pending_payment(self, student_id: int) -> dict:
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        student.pending_payment_due = False
        student.pending_payment_amount = 0.0
        student.pending_payment_link = None

        self.db.commit()
        self.db.refresh(student)
        status_data = self.get_pending_payment_status(student_id)
        status_data["message"] = "Payment completed. No due."
        return status_data

    # ========================================
    # Payment Workflow Methods (Auto-Population & Webhook Handling)
    # ========================================

    def auto_populate_pending_payments(self, program_id: int, batch: str, admission_year: str, semester: str) -> dict:
        """
        Auto-populate pending payments for all students matching workflow criteria
        Gets total_fee from FeeDetails and stores in Student pending_payment_amount
        Sets payment link from Collexo gateway
        """
        try:
            semester_candidates = self._semester_candidates(semester)

            if not semester_candidates:
                raise HTTPException(status_code=400, detail="Invalid semester value")

            # Get FeeDetails for this semester
            fee_details = self.db.query(FeeDetails).filter(
                FeeDetails.programe_id == program_id,
                FeeDetails.semester.in_(semester_candidates)
            ).first()

            if not fee_details:
                raise HTTPException(
                    status_code=404,
                    detail=f"Fee details not found for program {program_id}, semester {semester}"
                )

            total_fee = float(fee_details.total_fee or 0.0)
            if total_fee <= 0:
                raise HTTPException(status_code=400, detail="Total fee is 0 or invalid")

            # Build Collexo payment link with institution ID
            institution_id = settings.COLLEXO_INSTITUTION_ID
            payment_link = f"{settings.COLLEXO_PAYMENT_URL}?dest=/{institution_id}/applicant/add/"

            # Find all students matching criteria
            students = self.db.query(Student).filter(
                Student.program_id == program_id,
                Student.batch == batch,
                Student.admission_year == admission_year,
                Student.semester.in_(semester_candidates),
                Student.is_deleted == False
            ).all()

            if not students:
                return {
                    "message": "No students found matching criteria",
                    "updated_count": 0,
                    "students_updated": []
                }

            updated_students = []
            for student in students:
                student.pending_payment_due = True
                student.pending_payment_amount = total_fee
                student.pending_payment_link = payment_link
                student.pending_payment_semester = semester
                self.db.add(student)

                updated_students.append({
                    "id": student.id,
                    "registration_no": student.registration_no,
                    "amount": total_fee,
                    "link": payment_link
                })

            self.db.commit()

            logger.info(f"Auto-populated pending payments for {len(students)} students")
            return {
                "message": f"Successfully updated {len(students)} students with pending payments",
                "updated_count": len(students),
                "students_updated": updated_students
            }

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error auto-populating pending payments: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to auto-populate pending payments: {str(e)}")

    def handle_webhook_payment(self, student_id: int, gateway_transaction_id: str, 
                               payment_amount: float, semester: str, gateway_response: dict) -> dict:
        """
        Handle payment confirmation from Collexo webhook
        - Create PaymentTransaction record
        - Create Payment record for student
        - Create SemesterFee record
        - Clear pending payment flags
        """
        try:
            student = self.db.query(Student).filter(Student.id == student_id).first()
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # Create PaymentTransaction to track webhook
            payment_transaction = PaymentTransaction(
                student_id=student_id,
                gateway_transaction_id=gateway_transaction_id,
                gateway_name="collexo",
                amount=payment_amount,
                semester=semester,
                status="webhook_received",
                gateway_response=json.dumps(gateway_response),
                webhook_received_at=datetime.utcnow()
            )
            self.db.add(payment_transaction)
            self.db.flush()

            # Create Payment record
            payment = Payment(
                student_id=student_id,
                payment_type="semester_fee",
                transaction_id=gateway_transaction_id,
                payment_date=datetime.utcnow(),
                payment_amount=payment_amount,
                is_offline=False
            )
            self.db.add(payment)
            self.db.flush()

            # Create SemesterFee record
            semester_fee = SemesterFee(
                payment_id=payment.id,
                semester=semester,
                total_fee=payment_amount
            )
            self.db.add(semester_fee)

            # Link payment to transaction
            payment_transaction.payment_id = payment.id
            payment_transaction.status = "payment_created"
            payment_transaction.payment_confirmed_at = datetime.utcnow()

            # Clear pending payment flags
            student.pending_payment_due = False
            student.pending_payment_amount = 0.0
            student.pending_payment_link = None
            student.pending_payment_semester = None

            self.db.commit()
            self.db.refresh(student)

            logger.info(f"Payment processed for student {student_id}: transaction {gateway_transaction_id}")
            
            return {
                "message": "Payment processed successfully",
                "student_id": student_id,
                "payment_id": payment.id,
                "transaction_id": gateway_transaction_id,
                "amount": payment_amount,
                "status": "completed"
            }

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error handling webhook payment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to process webhook payment: {str(e)}")

    def verify_and_complete_pending_payment(self, student_id: int, transaction_id: str) -> dict:
        """
        Verify payment from transaction logs and mark pending payment as complete
        """
        try:
            student = self.db.query(Student).filter(Student.id == student_id).first()
            if not student:
                raise HTTPException(status_code=404, detail="Student not found")

            # Check if transaction exists
            transaction = self.db.query(PaymentTransaction).filter(
                PaymentTransaction.student_id == student_id,
                PaymentTransaction.gateway_transaction_id == transaction_id
            ).first()

            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")

            if transaction.status != "payment_created":
                raise HTTPException(status_code=400, detail=f"Payment already processed. Status: {transaction.status}")

            # Clear pending payment
            student.pending_payment_due = False
            student.pending_payment_amount = 0.0
            student.pending_payment_link = None
            student.pending_payment_semester = None

            self.db.commit()
            self.db.refresh(student)

            logger.info(f"Pending payment completed for student {student_id}")
            
            return {
                "message": "Pending payment completed",
                "student_id": student_id,
                "transaction_id": transaction_id,
                "amount": transaction.amount
            }

        except Exception as e:
            self.db.rollback()
            logger.error(f"Error completing pending payment: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to complete pending payment: {str(e)}")

    def get_all_students(self) -> List[StudentResponse]:
        """Retrieve all students with their details."""
        return self.student_repo.get_all_students()

    def update_student(self, student_id: int, student_data: Dict) -> Student:
        """Update an existing student."""
        return self.student_repo.update(student_id, student_data)

    # def delete_student(self, student_id: int) -> None:
    #     """Delete a student."""
    #     student = self.student_repo.get_by_id(student_id)
    #     self.student_repo.delete_by_id(student)
    #     return student  
    
    def extract_number(application_no: str) -> int:
        """Extract numberic part from application Number"""
        number = re.findall(r'\d+', application_no)
        return int(number[0]) if number else 0

    # async def sync_students(self):
    #     try:
    #         # Fetch from ERP
    #         students_data = await fetch_students_list()
    #         logger.info(f"Fetched {len(students_data)} students from external API.")

    #         if not students_data:
    #             return {"message": "No students found in external API.", "total_sync_count": 0}
            
    #         # Get last synced student ID from DB (handle None)
    #         last_synced_student = self.student_repo.get_last_sync_student()
            
    #         last_sync_id = last_synced_student.application_no.strip('OLUGDS') if last_synced_student else 0
            
    #         # Check if students_data is a dict with "data" and "list" or a direct list
    #         if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
    #             value_list = students_data["data"]["list"]
    #         else:
    #             value_list = students_data  # Assume students_data is already the list
        
    #         # Get last ERP student ID
    #         if not value_list[-1].get("application_no"):
    #             logger.error(f"Last student in ERP data lacks 'id' field: {students_data[-1]}")
    #             raise ValueError("Invalid ERP data: last student missing 'id' field")
    #         last_erp_id = value_list[-1].get("application_no", 0)
    #         logger.info(f"Last ERP ID: {last_erp_id}")

    #         #If already up to date
    #         if last_sync_id == last_erp_id:
    #             return {"message": "No new students to sync.", "total_sync_count": 0}
            
    #         #filtered_list = [item for item in value_list if item["application_no"] != "OLPGCIH100475" or item["application_no"] != "OLPGCIH100508"]
    #         filtered_list = [item for item in value_list if item["application_no"] not in ["OLPGCIH100475", "OLPGCIH100508"]]
            
    #         # Filter only new students
    #         new_students = [student for student in filtered_list if int(student.get("application_no", 0).strip('OLUGDS')) < int(last_sync_id) ]
    #         logger.info(f"Students to sync: {len(new_students)}")
            
    #         # Sync new students
    #         if len(new_students) > 0:
    #             for student_data in filtered_list:
    #                 self.student_repo.bulk_create_student(student_data)
    #             return {"message": "Students synced successfully", "total_sync_count": len(new_students)}
    #         else:
    #             return {"message": "No new students to sync.", "total_sync_count": len(new_students)}

    #     except Exception as e:
    #         logger.error(f"Error syncing students: {str(e)}")
    #         raise HTTPException(status_code=500, detail=f"Failed to sync students: {str(e)}")
    
    async def _get_students_from_erp(self):
        students_data = await fetch_students_list()
        logger.info(f"Fetched {len(students_data)} students from external API.")

        if not students_data:
            return []

        if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
            value_list = students_data["data"]["list"]
        else:
            value_list = students_data

        students = []

        for student in value_list:
            app_no = student.get("application_no")
            if not app_no:
                logger.warning(f"Skipping student with missing application_no: {student}")
                continue

            students.append(student)

        return students
    
    async def update_document_existing_sync_student(self):
        try:
            students = await self._get_students_from_erp()

            if not students:
                return {"message": "No students found", "total_sync_count": 0}

            for student in students:
                self.student_repo.bulk_document_update_student(student)

            return {
                "message": "Students updated successfully",
                "total_sync_count": len(students)
            }

        except Exception as e:
            logger.error(f"Error updating students: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
    async def update_semester_fees(self):
        try:
            students = await self._get_students_from_erp()

            if not students:
                return {"message": "No students found", "total_sync_count": 0}

            for student in students:
                self.student_repo.pay_next_semester_fee(student)

            return {
                "message": "Students updated successfully",
                "total_sync_count": len(students)
            }

        except Exception as e:
            logger.error(f"Error updating semester fee: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    # async def update_document_existing_sync_student(self):
    #     try:
    #         # Fetch from ERP
    #         students_data = await fetch_students_list()
    #         logger.info(f"Fetched {len(students_data)} students from external API.")

    #         if not students_data:
    #             return {"message": "No students found in external API.", "total_sync_count": 0}

    #         # Extract ERP list safely
    #         if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
    #             value_list = students_data["data"]["list"]
    #         else:
    #             value_list = students_data
                
    #         students_to_update = []  
    #         for student in value_list:
    #             app_no = student.get("application_no")
    #             if not app_no:
    #                 logger.warning(f"Skipping student with missing application_no: {student}")
    #                 continue

    #             else:
    #                 students_to_update.append(student)

    #         logger.info(f"Students to update: {len(students_to_update)}")

    #         # UPDATE EXISTING STUDENTS
    #         if students_to_update:
    #             for student in students_to_update:
    #                 self.student_repo.bulk_document_update_student(student)

    #             return {
    #                 "message": "Students updated successfully",
    #                 "total_sync_count": len(students_to_update)
    #             }

    #         return {"message": "No existing students to update.", "total_sync_count": 0}
        
    #     except Exception as e:
    #         logger.error(f"Error updating students: {str(e)}")
    #         raise HTTPException(status_code=500, detail=f"Failed to update students: {str(e)}")
    
    # async def update_semester_fees(self):
    #     try:
    #         # Fetch from ERP
    #         students_data = await fetch_students_list()
    #         logger.info(f"Fetched {len(students_data)} students from external API.")

    #         if not students_data:
    #             return {"message": "No students found in external API.", "total_sync_count": 0}

    #         # Extract ERP list safely
    #         if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
    #             value_list = students_data["data"]["list"]
    #         else:
    #             value_list = students_data
                
    #         students_to_update = []  
    #         for student in value_list:
    #             app_no = student.get("application_no")
    #             if not app_no:
    #                 logger.warning(f"Skipping student with missing application_no: {student}")
    #                 continue

    #             else:
    #                 students_to_update.append(student)

    #         logger.info(f"Students to update: {len(students_to_update)}")

    #         # UPDATE EXISTING STUDENTS
    #         if students_to_update:
    #             for student in students_to_update:
    #                 self.student_repo.pay_next_semester_fee(student)

    #             return {
    #                 "message": "Students updated successfully",
    #                 "total_sync_count": len(students_to_update)
    #             }

    #         return {"message": "No existing students to update.", "total_sync_count": 0}
        
    #     except Exception as e:
    #         logger.error(f"Error updating students: {str(e)}")
    #         raise HTTPException(status_code=500, detail=f"Failed to update students: {str(e)}")
    

    async def sync_students(self):
        try:
            # Fetch from ERP
            students_data = await fetch_students_list()
            logger.info(f"Fetched {len(students_data)} students from external API.")

            if not students_data:
                return {"message": "No students found in external API.", "total_sync_count": 0}

            # Extract ERP list safely
            if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
                value_list = students_data["data"]["list"]
            else:
                value_list = students_data

            # FETCH all already-synced application numbers from DB
            existing_rows = self.student_repo.get_all_application_nos()
            # Convert into a set of strings
            existing_ids = {
                row if isinstance(row, str) else row.get("application_no")
                for row in existing_rows
            }

            logger.info(f"Existing students in DB: {len(existing_ids)}")

            # IDENTIFY ONLY NEW STUDENTS
            new_students = []  
            for student in value_list:
                app_no = student.get("application_no")
                if not app_no:
                    logger.warning(f"Skipping student with missing application_no: {student}")
                    continue

                if app_no not in existing_ids:
                    new_students.append(student)

            logger.info(f"Students to sync: {len(new_students)}")

            # SYNC NEW STUDENTS
            if new_students:
                for student in new_students:
                    self.student_repo.bulk_create_student(student)

                return {
                    "message": "Students synced successfully",
                    "total_sync_count": len(new_students)
                }

            return {"message": "No new students to sync.", "total_sync_count": 0}

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error syncing students: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to sync students: {str(e)}")
        
    def delete_student_by_id(self, student_id) -> dict:
        # check student exists
        try:
            # call repo (repo does not commit)
            result = self.student_repo.delete_student_by_id(student_id)
            # commit here to make the operation atomic
            self.db.commit()
            return {
                "message": "Payments and related mappings deleted successfully",
                **result
            }
        except HTTPException:
            raise
        except SQLAlchemyError as e:
            # rollback and convert to HTTP 500
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"DB error: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")

    def delete_all_students(self) -> None:
        """
        Orchestrate a full delete inside a single transaction.
        Raises HTTPException on DB errors.
        """
        try:
            # Start a transaction only if none is active
            if not self.db.in_transaction():
                with self.db.begin():
                    self.student_repo.delete_all_students()
            else:
                # caller manages transaction
                self.student_repo.delete_all_students()
        except SQLAlchemyError as e:
            # convert to HTTP error for the router
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"DB error: {str(e)}"
            )
            
class StudentMarkService:

    @staticmethod
    def create_student_marks(db: Session, data: StudentMarkCreate):
        # You can add validation here (like student exists)

        marks = StudentMarkRepository.create_marks(
            db=db,
            student_id=data.student_id,
            marks=data.mark_list
        )

        return marks
    
    @staticmethod
    def list_students_with_marks(db):
        students = StudentMarkRepository.get_all_students_with_marks(db)

        result = []
        for student in students:
            result.append({
                "id": student.id,
                "name": f"{student.first_name} {student.last_name}",
                "reg_no": student.registration_no,
                "program": student.program_id,
                "marks": student.student_mark_temp or []   # ✅ importan
            })

        return result
    
    @staticmethod
    def get_student_with_marks(db, student_id: int):
        student = StudentMarkRepository.get_student_with_marks(db, student_id)

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        return {
            "id": student.id,
            "name": f"{student.first_name} {student.last_name}",
            "reg_no": student.registration_no,
            "program": student.program_id,
            "marks": student.student_mark_temp or []
        }
