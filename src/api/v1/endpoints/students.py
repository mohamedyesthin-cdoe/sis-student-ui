from typing import List
from src.services.student_service import StudentService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.schemas.students import StudentCreate, StudentResponse, SyncResponse

router = APIRouter()

@router.post("/students/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student_data: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student."""
    student_service = StudentService(db)
    return student_service.create_student(student_data)

@router.post("/students/sync", response_model=SyncResponse)
async def sync_students_endpoint(db: Session = Depends(get_db)):
    try:
        service = StudentService(db)
        return await service.sync_students()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@router.get("/students", response_model=List[StudentResponse])
def get_students(service: StudentService = Depends(lambda: StudentService(Depends(get_db)))):
    students = service.get_all_students()
    return students