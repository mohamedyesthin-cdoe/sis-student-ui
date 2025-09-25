from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from src.models.students import *
from src.models.payment import *
from src.models.master import Programe, FeeDetails
from src.repositories.base import BaseRepository
from src.schemas.students import StudentBase
from sqlalchemy.exc import IntegrityError
from src.utils.register_number import generate_registration_number
from src.services.integrations.student_mapper import (
    map_api_to_student_schema, timestamp_to_date, safe_float, parse_date, ensure_datetime
)

class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session):
        super().__init__(db, Student)

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
        
    def get_last_sync_student(self):
        result = self.db.query(Student).order_by(Student.id.desc()).first()
        return result
        
    def bulk_create_student(self, api_response: dict):
        try:
            # --- 1. Fetch program and validate ---
            student_data = map_api_to_student_schema(api_response)
            
            program = self.db.query(Programe).filter(Programe.id == student_data.get("program_id")).first()
            
            if not program:
                raise ValueError("Invalid program_id provided")

            program_code = program.programe_code

            # --- 2. Get last registration number (only 1 DB call) ---
            last_student = self.get_last_sync_student()
            last_reg_no = last_student.registration_no if last_student else None

            # Generate new registration number
            registration_number = generate_registration_number(program_code, last_reg_no)

            # --- 3. Validate input data with Pydantic ---
            # This ensures correct data types before proceeding
            student_data['registration_no'] = registration_number  # Add generated reg no
            
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
                "document_details": DocumentDetails,
                "declaration_details": DeclarationDetails,
                "deb_details": DebDetails
            }

            # Iterate through related data and create if present
            for key, model in related_models.items():
                details_data = student_data.get(key)
                if details_data:
                    self.db.add(model(student_id=student.id, **details_data))
            
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
                    total_fee=float(fee_details.total_fee),
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
