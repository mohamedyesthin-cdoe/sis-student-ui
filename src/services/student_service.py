from src.repositories.students import StudentRepository
from src.models.students import Student
from sqlalchemy.orm import Session
from typing import List, Dict
from src.schemas.students import StudentCreate, StudentResponse
import httpx
from src.services.integrations.student_api import fetch_students_list
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
            students_data = await fetch_students_list()
            logger.info(f"Fetched {len(students_data)} students from external API.")

            if not students_data:
                return {"message": "No students found in external API.", "total_sync_count": 0}
            
            # Get last synced student ID from DB (handle None)
            last_synced_student = self.student_repo.get_last_sync_student()
            
            last_sync_id = last_synced_student.application_no.strip('OLUGDS') if last_synced_student else 0
            
            # Check if students_data is a dict with "data" and "list" or a direct list
            if isinstance(students_data, dict) and "data" in students_data and "list" in students_data["data"]:
                value_list = students_data["data"]["list"]
            else:
                value_list = students_data  # Assume students_data is already the list

            # Get last ERP student ID
            if not value_list[-1].get("application_no"):
                logger.error(f"Last student in ERP data lacks 'id' field: {students_data[-1]}")
                raise ValueError("Invalid ERP data: last student missing 'id' field")
            last_erp_id = value_list[-1].get("application_no", 0)
            logger.info(f"Last ERP ID: {last_erp_id}")

            #If already up to date
            if last_sync_id == last_erp_id:
                return {"message": "No new students to sync.", "total_sync_count": 0}
            
            filtered_list = [item for item in value_list if item["application_no"] != "OLPGCIH100475"]

            # Filter only new students
            new_students = [student for student in filtered_list if int(student.get("application_no", 0).strip('OLUGDS')) > int(last_sync_id) ]
            logger.info(f"Students to sync: {len(new_students)}")
            
            # Sync new students
            if len(new_students) > 0:
                for student_data in filtered_list:
                    self.student_repo.bulk_create_student(student_data)
                return {"message": "Students synced successfully", "total_sync_count": len(new_students)}
            else:
                return {"message": "No new students to sync.", "total_sync_count": len(new_students)}

        except Exception as e:
            logger.error(f"Error syncing students: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to sync students: {str(e)}")
