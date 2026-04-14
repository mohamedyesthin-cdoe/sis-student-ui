from typing import List, Optional
from fastapi import APIRouter, Depends, Query, UploadFile, Form
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.core.security.dependencies import require_staff
from src.core.security.jwt import get_current_user
from src.schemas.grievance import (
    GrievanceCreate,
    GrievanceUpdate,
    GrievanceAdminResponse,
    GrievancePublicResponse,
    GrievanceStatusUpdate,
    GrievanceAssign,
    GrievanceFacultyStatusUpdate,
    GrievanceFacultyResponse
)
from src.services.grievance_service import GrievanceService
from src.services.student_service import StudentService
from src.utils.s3_service import DocumentService
from src.utils.email import send_grievance_email
from src.models.user import User


router = APIRouter()

# -------- Student-friendly alias routes --------
@router.post("/add", response_model=GrievanceFacultyResponse, status_code=201)
async def create_grievance_alias(
    subject: str = Form(...),
    description: str = Form(...),
    student_id: Optional[int] = Form(None),
    file: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
):
    student_name = None
    if student_id:
        student_service = StudentService(db)
        student = student_service.get_student_id(student_id)
        student_name = f"{student.first_name} {student.last_name}" if student else None
    attachment_url = None
    if file:
        doc_service = DocumentService()
        attachment_url = await doc_service.upload_to_s3(file)

    payload = GrievanceCreate(
        subject=subject,
        description=description,
        attachment_url=attachment_url,
        student_id=student_id,
    )
    service = GrievanceService(db)
    grievance = service.create_grievance(payload)

    await send_grievance_email(
        email_to="cdoesupport@sriramachandra.edu.in",
        action="created",
        grievance_id=grievance.id,
        subject_line=grievance.subject,
        student_name=student_name,
        attachment_url=grievance.attachment_url,
    )

    return grievance


@router.get("/list", response_model=List[GrievancePublicResponse])
def list_grievances_alias(
    student_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.list_grievances_public(student_id=student_id)


@router.get("/grievance/{grievance_id}", response_model=GrievancePublicResponse)
def get_grievance_alias(
    grievance_id: int,
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.get_grievance_public(grievance_id)


@router.put("/update/{grievance_id}", response_model=GrievanceFacultyResponse)
async def update_grievance_alias(
    grievance_id: int,
    subject: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = None,
    db: Session = Depends(get_db),
):
    attachment_url = None
    if file:
        doc_service = DocumentService()
        attachment_url = await doc_service.upload_to_s3(file)

    payload = GrievanceUpdate(
        subject=subject,
        description=description,
        attachment_url=attachment_url,
    )
    service = GrievanceService(db)
    grievance = service.update_grievance(grievance_id, payload)

    student_name = None
    if grievance.student_id:
        student_service = StudentService(db)
        student = student_service.get_student_id(grievance.student_id)
        student_name = f"{student.first_name} {student.last_name}" if student else None

    await send_grievance_email(
        email_to="cdoesupport@sriramachandra.edu.in",
        action="updated",
        grievance_id=grievance.id,
        subject_line=grievance.subject,
        student_name=student_name,
        attachment_url=grievance.attachment_url,
    )

    return grievance


@router.delete("/delete/{grievance_id}", status_code=204)
def delete_grievance_alias(
    grievance_id: int,
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    grievance = service.get_grievance(grievance_id)
    student_name = None
    if grievance.student_id:
        student_service = StudentService(db)
        student = student_service.get_student_id(grievance.student_id)
        student_name = f"{student.first_name} {student.last_name}" if student else None

    service.delete_grievance(grievance_id)
    # Notify support (best effort fire-and-forget)
    try:
        import asyncio
        asyncio.create_task(
            send_grievance_email(
                email_to="cdoesupport@sriramachandra.edu.in",
                action="deleted",
                grievance_id=grievance_id,
                subject_line="N/A",
                student_name=student_name,
                attachment_url=grievance.attachment_url,
            )
        )
    except RuntimeError:
        pass
    return None


@router.get(
    "/admin/list",
    response_model=List[GrievanceAdminResponse],
    dependencies=[Depends(require_staff)],
)
def list_grievances_admin(
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.list_grievances_with_details()


@router.post(
    "/admin/close/{grievance_id}",
    response_model=GrievanceFacultyResponse,
    dependencies=[Depends(require_staff)],
)
def admin_close_grievance(
    grievance_id: int,
    payload: GrievanceStatusUpdate,
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.admin_close(grievance_id, payload)


@router.get(
    "/admin/{grievance_id}",
    response_model=GrievanceAdminResponse,
    dependencies=[Depends(require_staff)],
)
def get_grievance_for_admin(
    grievance_id: int,
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.get_grievance_with_details(grievance_id)


@router.post(
    "/admin/assign/{grievance_id}",
    response_model=GrievanceAdminResponse,
    dependencies=[Depends(require_staff)],
)
def admin_assign_grievance(
    grievance_id: int,
    payload: GrievanceAssign,
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.assign_grievance(grievance_id, payload)


@router.get(
    "/faculty/list",
    response_model=List[GrievanceFacultyResponse],
    dependencies=[Depends(require_staff)],
)
def list_faculty_grievances(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.list_for_faculty(current_user.id)


@router.get(
    "/faculty/{grievance_id}",
    response_model=GrievanceFacultyResponse,
    dependencies=[Depends(require_staff)],
)
def get_faculty_grievance(
    grievance_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.get_for_faculty(grievance_id, current_user.id)


@router.post(
    "/faculty/status/{grievance_id}",
    response_model=GrievanceFacultyResponse,
    dependencies=[Depends(require_staff)],
)
def faculty_update_status(
    grievance_id: int,
    payload: GrievanceFacultyStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = GrievanceService(db)
    return service.faculty_update_status(grievance_id, current_user.id, payload)