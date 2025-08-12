from typing import List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select
from src.models.students import *
from src.repositories.base import BaseRepository
from src.schemas.students import StudentBase
from sqlalchemy.exc import IntegrityError
from src.utils.register_number import generate_registration_number

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
        # result = self.db.execute(select(self.model))
        # print(f"Total students fetched: {result}")
        # return result.scalars().all()
        """Retrieve all students."""
        return self.db.query(Student).all()
    
    def get_all_students(self) -> List[Student]:
        try:
            print("Fetching all students from the repository...")
            students = self.db.query(Student).options(
                joinedload(Student.address_details),
                joinedload(Student.academic_details),
                joinedload(Student.document_details),
                joinedload(Student.declaration_details),
                joinedload(Student.deb_details)
            ).filter(Student.is_deleted == False).all()
            return students
        except Exception as e:
            raise e

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

    # def bulk_create_student(self, student_data: dict):
    #     try:
    #         # Validate input data with Pydantic schema
    #         program_id = self.db.query(Programe).filter(Programe.id == student_data.get("program_id")).first()
    #         program_code = program_id.programe_code
    #         last_reg_no = self.get_last_sync_student().registration_no if self.get_last_sync_student() else None
    #         registration_number = generate_registration_number(program_code, last_reg_no)
    #         print(f"Last registration number: {last_reg_no.id}")
    #         student_schema = StudentBase(**student_data)
    #         # Check for existing student
    #         existing_student = self.db.query(Student).filter(
    #             (Student.application_no == student_data["application_no"]) |
    #             (Student.email == student_data["email"])
    #         ).first()
    #         if existing_student:
    #             return existing_student.id
            
    #         validated_data = Student.__table__.columns.keys()
    #         print(f"Validated data keys: {validated_data}")
    #         student_data_filtered = {k: v for k, v in student_data.items() if k in validated_data}
    #         print(f"Filtered student data: {student_data_filtered}")
    #         # Create student and relatd models
    #         student = Student(**student_data_filtered)
    #         print(f"Creating student with data: {student_data}")
    #         self.db.add(student)
    #         self.db.flush()

    #         # Create AddressDetails
    #         address_data = student_data["address_details"]
    #         address = AddressDetails(student_id=student.id, **address_data)
    #         self.db.add(address)

    #         # Create AcademicDetails
    #         academic_data = student_data["academic_details"]
    #         academic = AcademicDetails(student_id=student.id, **academic_data)
    #         self.db.add(academic)

    #         # Create DocumentDetails
    #         document_data = student_data["document_details"]
    #         document = DocumentDetails(student_id=student.id, **document_data)
    #         self.db.add(document)

    #         # Create Declaration
    #         declaration_data = student_data["declaration_details"]
    #         declaration = DeclarationDetails(student_id=student.id, **declaration_data)
    #         self.db.add(declaration)

    #         #Create Deb
    #         deb_data = student_data["deb_details"]
    #         deb = DebDetails(student_id=student.id, **deb_data)
    #         self.db.add(deb)  

    #         self.db.commit()
    #         self.db.refresh(student)
    #         return student.id
    #     except IntegrityError as e:
    #         self.db.rollback()
    #         raise ValueError(f"Database integrity error: {str(e)}")
    #     except Exception as e:
    #         self.db.rollback()
    #         raise ValueError(f"Error creating student: {str(e)}")

    def bulk_create_student(self, student_data: dict):
        try:
            # --- 1. Fetch program and validate ---
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
