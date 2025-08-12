from src.repositories.students import StudentRepository
from src.models.students import Student
from sqlalchemy.orm import Session
from typing import List, Dict
from src.schemas.students import StudentCreate, StudentResponse
import httpx
from src.services.integrations.student_api import fetch_students_from_erp
import logging
from fastapi import HTTPException
import traceback
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StudentService:
    def __init__(self, db: Session):
        self.student_repo = StudentRepository(db)

    def create_student(self, student_data: StudentCreate) -> Student:
        """Create a new student."""
        return self.student_repo.create(student_data)

    def get_student_by_id(self, student_id: int) -> Student:
        """Retrieve a student by ID."""
        return self.student_repo.get_by_id(student_id)

    def get_all_students(self) -> List[StudentResponse]:
        """Retrieve all students with their details."""
        print("Fetching all students from the repository...")
        return self.student_repo.get_all_students()

    def update_student(self, student_id: int, student_data: Dict) -> Student:
        """Update an existing student."""
        return self.student_repo.update(student_id, student_data)

    def delete_student(self, student_id: int) -> None:
        """Delete a student."""
        student = self.student_repo.get_by_id(student_id)
        self.student_repo.delete(student)
        return student  

    async def sync_students(self):
        try:
            # Fetch from ERP
            students_data = await fetch_students_from_erp()
            logger.info(f"Fetched {len(students_data)} students from external API.")

            if not students_data:
                return {"message": "No students found in external API.", "total_sync_count": 0}
            
            # Get last synced student ID from DB (handle None)
            last_synced_student = self.student_repo.get_last_sync_student()
            last_sync_id = last_synced_student.id if last_synced_student else 0

            # Get last ERP student ID
            if not students_data[-1].get("id"):
                logger.error(f"Last student in ERP data lacks 'id' field: {students_data[-1]}")
                raise ValueError("Invalid ERP data: last student missing 'id' field")
            last_erp_id = students_data[-1].get("id", 0)
            logger.info(f"Last ERP ID: {last_erp_id}")

            # If already up to date
            if last_sync_id == last_erp_id:
                return {"message": "No new students to sync.", "total_sync_count": 0}

            # Filter only new students
            new_students = [student for student in students_data if student.get("id", 0) > last_sync_id]
            logger.info(f"Students to sync: {len(new_students)}")

            # Sync new students
            for student_data in new_students:
                self.student_repo.bulk_create_student(student_data)

            return {"message": "Students synced successfully", "total_sync_count": len(new_students)}

        except Exception as e:
            logger.error(f"Error syncing students: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to sync students: {str(e)}")

    # def get_all_students(self):
    #     return self.student_repo.get_all_students()
    
# import logging
# from sqlalchemy.orm import Session
# from src.repositories.students import StudentRepository
# from src.services.integrations.student_api import fetch_students
# from src.schemas.students import StudentCreate
# from pydantic import ValidationError
# from typing import Dict, List

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# class StudentService:
#     def __init__(self, db: Session):
#         self.student_repo = StudentRepository(db)

#     async def sync_students(self) -> Dict[str, any]:
#         logger.info("Syncing students from external API...")
#         try:
#             # Fetch students from external API
#             students_data = await fetch_students()
#             logger.info(f"Fetched {len(students_data)} students from external API.")

#             # Validate each student against StudentCreate schema
#             validated_students = []
#             for student_data in students_data:
#                 try:
#                     validated_student = StudentCreate(**student_data)
#                     validated_students.append(validated_student)
#                 except ValidationError as e:
#                     logger.warning(f"Invalid student data: {e}")
#                     continue  # Skip invalid data

#             # Use a single transaction for all creations
#             created_ids = []
#             try:
#                 for student in validated_students:
#                     student_id = self.student_repo.create_student(student)  # Renamed for clarity
#                     created_ids.append(student_id)
#                 self.student_repo.db.commit()
#             except Exception as e:
#                 self.student_repo.db.rollback()
#                 logger.error(f"Failed to sync students: {str(e)}")
#                 raise Exception(f"Database error during sync: {str(e)}")

#             return {
#                 "message": "Students synced successfully",
#                 "count": len(created_ids),
#                 "student_ids": created_ids
#             }

#         except Exception as e:
#             logger.error(f"Error syncing students: {str(e)}")
#             raise Exception(f"Failed to sync students: {str(e)}")