from grpc import Status
from src.repositories.students import StudentRepository
from src.models.students import Student
from sqlalchemy.orm import Session
from typing import List, Dict
from src.schemas.students import StudentCreate, StudentResponse
import httpx
from src.services.integrations.student_api import fetch_students_list
import logging
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
import traceback
import re

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
    
    async def update_existing_sync_student(self):
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

            # IDENTIFY ONLY EXISTING STUDENTS TO UPDATE
            students_to_update = []  
            for student in value_list:
                app_no = student.get("application_no")
                if not app_no:
                    logger.warning(f"Skipping student with missing application_no: {student}")
                    continue

                if app_no in existing_ids:
                    students_to_update.append(student)

            logger.info(f"Students to update: {len(students_to_update)}")

            # UPDATE EXISTING STUDENTS
            if students_to_update:
                for student in students_to_update:
                    print(student)
                    self.student_repo.bulk_update_student(student)

                return {
                    "message": "Students updated successfully",
                    "total_sync_count": len(students_to_update)
                }

            return {"message": "No existing students to update.", "total_sync_count": 0}
        
        except Exception as e:
            logger.error(f"Error updating students: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to update students: {str(e)}")

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
                    print(student)
                    self.student_repo.bulk_create_student(student)

                return {
                    "message": "Students synced successfully",
                    "total_sync_count": len(new_students)
                }

            return {"message": "No new students to sync.", "total_sync_count": 0}

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
            