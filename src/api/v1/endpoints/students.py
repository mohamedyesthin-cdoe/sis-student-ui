from typing import List
from src.services.student_service import StudentMarkService, StudentService
from src.services.integrations.student_api import get_deb_student_details, push_deb_student_details
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.schemas.students import MarkResponse, StudentCreate, StudentListResponse, StudentMarkCreate, StudentResponse, SyncResponse, DebResponse
from src.schemas.students import PendingPaymentAssignRequest, PendingPaymentStatusResponse
from src.schemas.payment import PaymentResponse
from src.core.security.dependencies import require_superuser, require_staff
from src.core.security.jwt import get_current_user
from src.models.user import User
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()


def _can_access_student_record(current_user: User, student_id: int) -> bool:
    if current_user.is_superuser:
        return True
    if getattr(current_user, "staff", None):
        return True
    return getattr(current_user, "student_id", None) == student_id

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
def get_students_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all students."""
    try:
        if not _can_access_student_record(current_user, id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
        service = StudentService(db)
        student = service.get_student_id(id)
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve students: {str(e)}")
    
@router.get("/fees/{id}", response_model=List[PaymentResponse])
def get_fees(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        if not _can_access_student_record(current_user, id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
        service = StudentService(db)
        payments = service.get_fees(id)
        if not payments:
            raise HTTPException(status_code=404, detail="No payments found")
        return payments
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve payments: {str(e)}")


@router.get(
    "/{id}/pending-payment",
    response_model=PendingPaymentStatusResponse
)
def get_pending_payment_status(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        if not _can_access_student_record(current_user, id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
        service = StudentService(db)
        return service.get_pending_payment_status(id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve pending payment status: {str(e)}")


@router.put(
    "/{id}/pending-payment",
    response_model=PendingPaymentStatusResponse
)
def assign_pending_payment(
    id: int,
    payload: PendingPaymentAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff)
):
    try:
        service = StudentService(db)
        return service.assign_pending_payment(
            student_id=id,
            payment_link=payload.payment_link,
            amount=payload.amount,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assign pending payment: {str(e)}")


@router.post(
    "/{id}/pending-payment/complete",
    response_model=PendingPaymentStatusResponse
)
def complete_pending_payment(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
    try:
        service = StudentService(db)
        return service.complete_pending_payment(id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete pending payment: {str(e)}")

    
@router.delete("/delete/all", status_code=204, response_model=None)
def delete_all_students(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        StudentService(db).delete_all_students()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to delete all students")
    
@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student_by_id(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
    """Delete a payment by ID."""
    try:
        service = StudentService(db)
        success = service.delete_student_by_id(student_id)
        if not success:
            raise HTTPException(status_code=404, detail="Payment not found")
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete payment: {str(e)}")
    
@router.post("/student-marks/", response_model=List[MarkResponse])
def create_student_marks(
    request: StudentMarkCreate,
    db: Session = Depends(get_db)
):
    return StudentMarkService.create_student_marks(db, request)

@router.get("/students/marks", response_model=List[StudentListResponse])
def get_students_marks(db: Session = Depends(get_db)):
    return StudentMarkService.list_students_with_marks(db)

@router.get("/students/{student_id}/marks", response_model=StudentListResponse)
def get_student_marks(student_id: int, db: Session = Depends(get_db)):
    return StudentMarkService.get_student_with_marks(db, student_id)
