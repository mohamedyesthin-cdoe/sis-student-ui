from typing import List
from src.services.student_service import StudentService
from src.services.integrations.student_api import get_deb_student_details, push_deb_student_details
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.schemas.students import StudentCreate, StudentResponse, SyncResponse, DebResponse
from src.schemas.payment import PaymentResponse
from src.core.security.dependencies import require_superuser, require_staff
from src.models.user import User
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()

# @router.post("/add", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
# def create_student(student_data: StudentCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     """Create a new student."""
#     student_service = StudentService(db)
#     return student_service.create_student(student_data)

@router.post("/sync", response_model=SyncResponse)
async def sync_students_endpoint(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = StudentService(db)
        return await service.sync_students()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@router.post("/patch/document", response_model=SyncResponse)
async def update_document_existing_sync_student(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = StudentService(db)
        return await service.update_document_existing_sync_student()
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@router.get("/list", response_model=List[StudentResponse])
def get_all_students(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Retrieve all students."""
    try:
        service = StudentService(db)
        students = service.get_all_students()
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")
    
@router.get("/{id}", response_model=StudentResponse)
def get_students_by_id(id: int,db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
    """Retrieve all students."""
    try:
        service = StudentService(db)
        student = service.get_student_id(id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")
    
@router.get("/fees/{id}", response_model=List[PaymentResponse])
def get_fees(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
    try:
        service = StudentService(db)
        payments = service.get_fees(id)
        if not payments:
            raise HTTPException(status_code=404, detail="No payments found")
        return payments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve payments: {str(e)}")
    
# @router.delete("/delete/all", status_code=204, response_model=None)
# def delete_all_students(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         StudentService(db).delete_all_students()
#     except SQLAlchemyError as e:
#         raise HTTPException(status_code=500, detail="Failed to delete all students")
    
# @router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_student_by_id(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
#     """Delete a payment by ID."""
#     try:
#         service = StudentService(db)
#         success = service.delete_student_by_id(student_id)
#         if not success:
#             raise HTTPException(status_code=404, detail="Payment not found")
#         return
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to delete payment: {str(e)}")