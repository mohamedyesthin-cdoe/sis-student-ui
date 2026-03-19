import contextlib
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from sqlalchemy import delete
from src.models.students import *
from src.models.payment import *
from src.models.master import Programe, FeeDetails
from src.repositories.base import BaseRepository
from src.schemas.students import StudentBase
from sqlalchemy.exc import IntegrityError
from src.utils.register_number import generate_registration_number
from src.services.integrations.student_mapper import (
    map_api_to_student_schema, timestamp_to_date, safe_float, parse_date, ensure_datetime,
    map_patch_api_to_student_schema
)
from sqlalchemy.exc import SQLAlchemyError
from src.utils.s3_service import DocumentService

class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session):
        super().__init__(db, Student)
        self.document_service = DocumentService()

    def get_by_id(self, student_id: int) -> Student:
        result = self.db.execute(select(self.model).where(self.model.id == student_id))
        student = result.scalars().first()
        if not student:
            raise ValueError(f"Student with id {student_id} does not exist.")
        return student

    def get_all(self) -> list[Student]:
        """Retrieve all students."""
        return self.db.query(Student).all()
    
    def get_all_students(self) -> List[Student]:
        try:
            students = self.db.query(Student).options(
                joinedload(Student.address_details),
                joinedload(Student.academic_details),
                joinedload(Student.document_details),
                joinedload(Student.declaration_details),
                joinedload(Student.deb_details),
                joinedload(Student.payments).joinedload(Payment.semester_fee),
                joinedload(Student.payments).joinedload(Payment.application_fee)
            ).order_by(Student.id.asc()).all()
            
            #students = self.db.query(Student).all()
            return students
        except Exception as e:
            raise e
        
    def get_all_application_nos(self) -> List[str]:
        try:
            application_nos = self.db.query(Student.application_no).all()
            return [app_no[0] for app_no in application_nos]
        except Exception as e:
            raise e
    
    def get_student_by_id(self, student_id: int) -> Student:
        try:
            students = self.db.query(Student).options(
                joinedload(Student.address_details),
                joinedload(Student.academic_details),
                joinedload(Student.document_details),
                joinedload(Student.declaration_details),
                joinedload(Student.deb_details),
                joinedload(Student.payments).joinedload(Payment.semester_fee),
                joinedload(Student.payments).joinedload(Payment.application_fee)
            ).filter(Student.id == student_id).first()
            
            #students = self.db.query(Student).all()
            return students
        except Exception as e:
            raise e
        
    def get_fees(self, student_id: int) -> Student:
        try:
            students = self.db.query(Payment).options(
                joinedload(Payment.semester_fee),
                joinedload(Payment.application_fee)
            ).filter(Payment.student_id == student_id).all()
            
            #students = self.db.query(Student).all()
            return students
        except Exception as e:
            raise e

    def get_first_student_id(self) -> Optional[int]:
        first = self.db.query(Student).order_by(Student.id.asc()).first()
        return first.id if first else None

    def update(self, student_id: int, obj_data: dict) -> Student:
        student = self.get_by_id(student_id)
        for key, value in obj_data.items():
            if hasattr(student, key):
                setattr(student, key, value)
        try:
            self.db.commit()
            self.db.refresh(student)
            return student
        except Exception as e:
            self.db.rollback()
            raise e
        
    def get_last_sync_student(self, program_code):
        result = self.db.query(Student).filter(Student.registration_no.like(f"{program_code}%")).order_by(Student.id.desc()).first()
        return result
    
    def get_last_paymentdate(self, student_id: int):
        result = self.db.query(Payment).filter(Payment.student_id == student_id).order_by(Payment.payment_date.desc()).first()
        return result.payment_date if result else None
        
    def bulk_document_update_student(self, api_response: dict):
        try:
            student_data = map_patch_api_to_student_schema(api_response)
            # Fetch existing student by application_no or email
            existing_student = (
                self.db.query(Student)
                .filter(Student.application_no == student_data.get("application_no"))
                .first()
            )

            if not existing_student:
                return None

            if not existing_student:
                raise ValueError("Student does not exist for update")

            # List of valid columns in Student model
            student_columns = {column.name for column in Student.__table__.columns}

            for key, value in student_data.items():
                if key in student_columns:
                    setattr(existing_student, key, value)

            if "document_details" in student_data:
                doc_data = student_data["document_details"]

                if doc_data and existing_student.document_details:
                    for key, value in doc_data.items():
                        if value:   # only if file URL exists

                            s3_url = self.document_service.upload_external_file(
                                file_url=value,
                                program_id=existing_student.program_id,
                                register_number=existing_student.registration_no,
                                document_type=key
                            )

                            if s3_url and hasattr(existing_student.document_details, key):
                                setattr(existing_student.document_details, key, s3_url)

            #self.db.add(existing_student)
            self.db.commit()
            self.db.refresh(existing_student)
            return existing_student.id

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error during update: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error updating student: {str(e)}")
        
    def pay_next_semester_fee(self, api_response: dict):
        try:
            application_no = api_response.get("application_no")

            student = self.db.query(Student).filter(
                Student.application_no == application_no
            ).first()

            if not student:
                raise ValueError("Student not found")

            # Get next semester
            next_semester = student.semester_id + 1

            # Get fee structure
            fee_details = self.db.query(FeeDetails).filter(
                FeeDetails.programe_id == student.program_id,
                FeeDetails.semester == next_semester
            ).first()

            if not fee_details:
                raise ValueError("Fee structure not found for next semester")

            fee_data = api_response.get("semester_fee")

            # Create Payment
            payment = Payment(
                student_id=student.id,
                payment_type="semester_fee",
                order_id=fee_data.get("order_id"),
                transaction_id=fee_data.get("transaction_id"),
                payment_date=ensure_datetime(fee_data.get("payment_date")),
                payment_amount=fee_data.get("payment_amount"),
                is_offline=fee_data.get("is_offline", False),
            )

            self.db.add(payment)
            self.db.flush()

            # Create Semester Fee Record
            semester_fee = SemesterFee(
                payment_id=payment.id,
                semester=next_semester,
                admission_fee=float(fee_details.admission_fee),
                lab_fee=float(fee_details.lab_fee),
                lms_fee=float(fee_details.lms_fee),
                exam_fee=float(fee_details.exam_fee),
                tuition_fee=float(fee_details.tuition_fee),
                total_fee=float(fee_details.total_fee),
            )

            self.db.add(semester_fee)

            # Update student semester
            student.semester_id = next_semester

            self.db.commit()

            return {
                "student_id": student.id,
                "semester_paid": next_semester
            }

        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error updating semester fee: {str(e)}")
        
    def bulk_create_student(self, api_response: dict):
        try:
            # --- 1. Fetch program and validate ---
            student_data = map_api_to_student_schema(api_response)
            program = self.db.query(Programe).filter(Programe.id == student_data.get("program_id")).first()
            if not program:
                raise ValueError("Invalid program_id provided")

            program_code = program.programe_code
            batch = program.batch
            admission_year = program.admission_year
            admyr = admission_year.split("-")[0]
            # --- 2. Get last registration number (only 1 DB call) ---
            last_student = self.get_last_sync_student(program_code)
            last_reg_no = last_student.registration_no if last_student else None

            # Generate new registration number
            registration_number = generate_registration_number(program_code, last_reg_no, admyr)
            # --- 3. Validate input data with Pydantic ---
            # This ensures correct data types before proceeding
            student_data['registration_no'] = registration_number  # Add generated reg no
            student_data['batch'] = batch
            student_data['admission_year'] = admission_year
            student_data['semester_id'] = 1
            
            student_schema = StudentBase(**student_data)
            # --- 4. Check for existing student (application_no or email) ---
            existing_student = self.db.query(Student).filter(
                (Student.application_no == student_data["application_no"]) |
                (Student.email == student_data["email"])
            ).first()
            if existing_student:
                return existing_student.id  # Could also raise ValueError for duplicates

            # --- 5. Prepare filtered student data ---
            valid_columns = Student.__table__.columns.keys()
            student_data_filtered = {k: v for k, v in student_data.items() if k in valid_columns}
            #student_data_filtered["registration_no"] = registration_number  # Add generated reg no

            # --- 6. Create main Student record ---
            student = Student(**student_data_filtered)
            self.db.add(student)
            self.db.flush()  # Get student.id for related tables

            # --- 7. Related models mapping ---
            related_models = {
                "address_details": AddressDetails,
                "academic_details": AcademicDetails,
                "declaration_details": DeclarationDetails,
                "deb_details": DebDetails
            }

            # Iterate through related data and create if present
            for key, model in related_models.items():
                details_data = student_data.get(key)
                if details_data:
                    self.db.add(model(student_id=student.id, **details_data))
            
            # --- 7. Document Upload + Save ---
            if "document_details" in student_data and student_data["document_details"]:

                doc_data = student_data["document_details"]
                uploaded_docs = {}

                for key, value in doc_data.items():
                    if value:

                        s3_url = self.document_service.upload_external_file(
                            file_url=value,
                            program_id=student.program_id,
                            register_number=registration_number,
                            document_type=key
                        )

                        if s3_url:
                            uploaded_docs[key] = s3_url

                if uploaded_docs:
                    document = DocumentDetails(
                        student_id=student.id,
                        **uploaded_docs
                    )
                    self.db.add(document)

            # Application Fee
            if "application_fee" in student_data and student_data["application_fee"]:
                app_fee_data = student_data["application_fee"]

                payment = Payment(
                    student_id=student.id,   
                    payment_type="application_fee",
                    order_id=app_fee_data.get("order_id"),
                    transaction_id=app_fee_data.get("transaction_id"),
                    payment_date=ensure_datetime(app_fee_data.get("payment_date")),
                    payment_amount=app_fee_data.get("payment_amount", 0.0),
                    is_offline=app_fee_data.get("is_offline", False),
                    offline_transaction_id=app_fee_data.get("offline_transaction_id"),
                    offline_payment_method=app_fee_data.get("offline_payment_method"),
                    offline_receipt_enabled=app_fee_data.get("offline_receipt_enabled", False),
                )
                
                self.db.add(payment)
                self.db.flush()
                app_fee = ApplicationFee(payment_id=payment.id)
                self.db.add(app_fee)

            # Semester Fees (only 1st semester for initial sync)
            if "semester_fees" in student_data and student_data["semester_fees"] and student_data["semester_fees"][0]:  # Take first entry
                fee_data = student_data["semester_fees"][0]
                payment = Payment(
                    student_id=student.id,
                    payment_type="semester_fee",
                    order_id=fee_data.get("order_id"),
                    transaction_id=fee_data.get("transaction_id"),
                    payment_date=ensure_datetime(fee_data.get("payment_date")),
                    payment_amount=fee_data.get("payment_amount"),
                    is_offline=fee_data.get("is_offline"),
                )
                self.db.add(payment)
                self.db.flush()

                fee_details = self.db.query(FeeDetails).filter(
                    FeeDetails.programe_id == program.id).first()
                
                semester_fee = SemesterFee(
                    payment_id=payment.id,
                    semester=fee_details.semester,
                    admission_fee=float(fee_details.admission_fee),
                    lab_fee=float(fee_details.lab_fee),
                    lms_fee=float(fee_details.lms_fee),
                    exam_fee=float(fee_details.exam_fee),
                    tuition_fee=float(fee_details.tuition_fee),
                    total_fee=float(fee_details.admission_fee + fee_details.lab_fee + fee_details.lms_fee + fee_details.exam_fee + fee_details.tuition_fee),
                )
                self.db.add(semester_fee)

            # --- 8. Commit transaction ---
            self.db.commit()
            self.db.refresh(student)
            return student.id

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error creating student: {str(e)}")

    def delete_payments(self, student_id: int) -> dict:
        """
        Delete all ApplicationFee and SemesterFee rows referencing payments of the student,
        then delete the payments themselves. Returns counts.
        """
        # collect payment ids for the student
        payment_ids = (
            self.db.execute(select(Payment.id).where(Payment.student_id == student_id))
            .scalars()
            .all()
        )

        if not payment_ids:
            return {"deleted_application_rows": 0, "deleted_semester_rows": 0, "deleted_payments": 0}

        # delete child mapping rows first
        res_app = self.db.execute(
            delete(ApplicationFee).where(ApplicationFee.payment_id.in_(payment_ids))
        )
        deleted_application_rows = res_app.rowcount or 0

        res_sem = self.db.execute(
            delete(SemesterFee).where(SemesterFee.payment_id.in_(payment_ids))
        )
        deleted_semester_rows = res_sem.rowcount or 0

        # then delete payments
        res_pay = self.db.execute(
            delete(Payment).where(Payment.id.in_(payment_ids))
        )
        deleted_payments = res_pay.rowcount or 0

        return {
            "deleted_application_rows": deleted_application_rows,
            "deleted_semester_rows": deleted_semester_rows,
            "deleted_payments": deleted_payments,
        }
    
    def delete_student_mapping_table(self, student_id: int) -> dict:
        related_models = [
            AddressDetails,
            AcademicDetails,
            DocumentDetails,
            DeclarationDetails,
            DebDetails
        ]

        results = {}

        for model in related_models:
            res = self.db.execute(delete(model).where(model.student_id == student_id))
            results[model.__name__] = res.rowcount or 0
        
        return results

    def delete_student_by_id(self, student_id: int) -> dict:
        ctx = self.db.begin() if not self.db.in_transaction() else contextlib.nullcontext()
        try:
            with ctx:
                payment_detele = self.delete_payments(student_id)
                mapping_delete = self.delete_student_mapping_table(student_id)
                res_student = self.db.execute(delete(Student).where(Student.id == student_id))
                deleted_student = res_student.rowcount or 0
        
            summary = {
                "deleted_student": deleted_student,
                "payment_deletion": payment_detele,
                "mapping_deletion": mapping_delete
            }
            return summary
        except SQLAlchemyError as e:
            raise

    def delete_all_students(self) -> None:
        """
        Perform deletes in order so FK constraints do not block us:
        1) payment mapping tables (ApplicationFee, SemesterFee)
        2) Payments
        3) other student mapping tables (address, academic, documents, etc.)
        4) Users (which reference students)
        5) Students
        Return a dict with counts (optional).
        """
        # 1) Payment mapping tables
        res_app = self.db.execute(delete(ApplicationFee))
        res_sem = self.db.execute(delete(SemesterFee))

        # 2) Payments
        res_pay = self.db.execute(delete(Payment))

        # 3) Other student mapping tables
        related_models = [
            AddressDetails,
            AcademicDetails,
            DocumentDetails,
            DeclarationDetails,
            DebDetails,
        ]
        mapping_counts = {}
        for model in related_models:
            r = self.db.execute(delete(model))
            mapping_counts[model.__name__] = r.rowcount or 0

        # 5) Students last
        res_students = self.db.execute(delete(Student))

        return {
            "deleted_application_rows": res_app.rowcount or 0,
            "deleted_semester_rows": res_sem.rowcount or 0,
            "deleted_payments": res_pay.rowcount or 0,
            "deleted_mappings": mapping_counts,
            "deleted_students": res_students.rowcount or 0,
        }
    
class StudentMarkRepository:

    @staticmethod
    def create_marks(db: Session, student_id: int, marks: list):
        db_objects = []

        for mark in marks:
            obj = StudentMarkTemp(
                student_id=student_id,
                course_name=mark.course_name,
                final_marks=mark.final_mark
            )
            db.add(obj)
            db_objects.append(obj)

        db.commit()

        for obj in db_objects:
            db.refresh(obj)

        return db_objects
    
    @staticmethod
    def get_all_students_with_marks(db: Session):
        return db.query(Student).options(
            joinedload(Student.student_mark_temp)
        ).all()
    
    @staticmethod
    def get_student_with_marks(db: Session, student_id: int):
        return db.query(Student).options(
            joinedload(Student.student_mark_temp)
        ).filter(Student.id == student_id).first()