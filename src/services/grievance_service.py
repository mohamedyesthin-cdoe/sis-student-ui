from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.models.students import Student
from src.models.master import Programe
from src.models.grievance import Grievance
from src.models.staff import Staff
from src.schemas.grievance import (
    GrievanceCreate,
    GrievanceStatusUpdate,
    GrievanceUpdate,
    GrievanceAssign,
    GrievanceFacultyClose,
    GrievanceFacultyStatusUpdate,
)


class GrievanceService:
    def __init__(self, db: Session):
        self.db = db

    def create_grievance(self, data: GrievanceCreate) -> Grievance:
        grievance = Grievance(
            student_id=getattr(data, "student_id", None),
            name=getattr(data, "name", None) or "Anonymous",
            email=getattr(data, "email", None),
            mobile_number=getattr(data, "mobile_number", None),
            category="general",
            subject=data.subject,
            description=data.description,
            attachment_url=data.attachment_url,
        )
        self.db.add(grievance)
        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def list_grievances(
        self,
        student_id: Optional[int] = None,
        status_filter: Optional[str] = None,
    ) -> List[Grievance]:
        query = self.db.query(Grievance)

        if student_id is not None:
            query = query.filter(Grievance.student_id == student_id)
        if status_filter:
            query = query.filter(Grievance.status == status_filter)

        return query.order_by(Grievance.created_at.desc()).all()

    def list_grievances_public(
        self,
        student_id: Optional[int] = None,
    ) -> List[dict]:
        query = (
            self.db.query(Grievance, Student)
            .outerjoin(Student, Grievance.student_id == Student.id)
        )
        if student_id is not None:
            query = query.filter(Grievance.student_id == student_id)

        results = []
        for grievance, student in query.order_by(Grievance.created_at.desc()).all():
            results.append(
                {
                    "id": grievance.id,
                    "student_id": grievance.student_id,
                    "student_name": f"{student.first_name} {student.last_name}" if student else None,
                    "registration_no": student.registration_no if student else None,
                    "status": grievance.status,
                    "assigned_to_id": grievance.assigned_to_id,
                    "assigned_to_name": f"{grievance.assigned_to.first_name} {grievance.assigned_to.last_name}" if grievance.assigned_to else None,
                    "subject": grievance.subject,
                    "description": grievance.description,
                    "attachment_url": grievance.attachment_url,
                    "created_at": grievance.created_at,
                    "updated_at": grievance.updated_at,
                }
            )
        return results

    def list_grievances_with_details(self) -> List[dict]:
        query = (
            self.db.query(Grievance, Student, Programe)
            .outerjoin(Student, Grievance.student_id == Student.id)
            .outerjoin(Programe, Student.program_id == Programe.id)
            .order_by(Grievance.created_at.desc())
        )

        flat_list: List[dict] = []
        for grievance, student, _program in query.all():
            flat_list.append(
                {
                    "id": grievance.id,
                    "student_id": grievance.student_id,
                    "student_name": f"{student.first_name} {student.last_name}" if student else None,
                    "registration_no": student.registration_no if student else None,
                    "status": grievance.status,
                    "assigned_to_id": grievance.assigned_to_id,
                    "assigned_to_name": f"{grievance.assigned_to.first_name} {grievance.assigned_to.last_name}" if grievance.assigned_to else None,
                    "subject": grievance.subject,
                    "description": grievance.description,
                    "attachment_url": grievance.attachment_url,
                    "created_at": grievance.created_at,
                    "updated_at": grievance.updated_at,
                }
            )
        return flat_list

    def list_grievances_for_student_admin(self, student_id: int) -> List[Grievance]:
        return (
            self.db.query(Grievance)
            .filter(Grievance.student_id == student_id)
            .order_by(Grievance.created_at.desc())
            .all()
        )

    def get_grievance(self, grievance_id: int) -> Grievance:
        grievance = self.db.query(Grievance).filter(Grievance.id == grievance_id).first()
        if not grievance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grievance not found",
            )
        return grievance

    def get_grievance_public(self, grievance_id: int) -> dict:
        record = (
            self.db.query(Grievance, Student)
            .outerjoin(Student, Grievance.student_id == Student.id)
            .filter(Grievance.id == grievance_id)
            .first()
        )
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grievance not found",
            )
        grievance, student = record
        return {
            "id": grievance.id,
            "student_id": grievance.student_id,
            "student_name": f"{student.first_name} {student.last_name}" if student else None,
            "registration_no": student.registration_no if student else None,
            "status": grievance.status,
            "assigned_to_id": grievance.assigned_to_id,
            "assigned_to_name": f"{grievance.assigned_to.first_name} {grievance.assigned_to.last_name}" if grievance.assigned_to else None,
            "subject": grievance.subject,
            "description": grievance.description,
            "attachment_url": grievance.attachment_url,
            "created_at": grievance.created_at,
            "updated_at": grievance.updated_at,
        }

    def update_status(self, grievance_id: int, payload: GrievanceStatusUpdate) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        grievance.status = payload.status
        grievance.resolution_notes = payload.resolution_notes

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def assign_grievance(self, grievance_id: int, payload: GrievanceAssign) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        staff = self.db.query(Staff).filter(Staff.id == payload.staff_id).first()
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Faculty not found",
            )

        grievance.assigned_to_id = staff.id
        grievance.status = "assigned"
        if payload.notes:
            grievance.resolution_notes = payload.notes

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def faculty_close(self, grievance_id: int, staff_user_id: int, payload: GrievanceFacultyClose) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        # Ensure only assigned faculty can close
        staff = (
            self.db.query(Staff)
            .filter(Staff.user_id == staff_user_id)
            .first()
        )
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Faculty access required",
            )

        if grievance.assigned_to_id and grievance.assigned_to_id != staff.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Grievance assigned to another faculty",
            )

        grievance.assigned_to_id = staff.id  # in case it was missing
        grievance.status = "closed_by_faculty"
        grievance.resolution_notes = payload.resolution_notes

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def faculty_update_status(self, grievance_id: int, staff_user_id: int, payload: GrievanceFacultyStatusUpdate) -> Grievance:
        grievance = self.get_grievance(grievance_id)
        staff = (
            self.db.query(Staff)
            .filter(Staff.user_id == staff_user_id)
            .first()
        )
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Faculty access required",
            )
        if grievance.assigned_to_id != staff.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Grievance assigned to another faculty",
            )

        grievance.status = payload.status
        grievance.resolution_notes = payload.resolution_notes

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def list_for_faculty(self, staff_user_id: int) -> List[Grievance]:
        staff = (
            self.db.query(Staff)
            .filter(Staff.user_id == staff_user_id)
            .first()
        )
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Faculty access required",
            )
        return (
            self.db.query(Grievance)
            .filter(Grievance.assigned_to_id == staff.id)
            .order_by(Grievance.created_at.desc())
            .all()
        )

    def get_for_faculty(self, grievance_id: int, staff_user_id: int) -> Grievance:
        grievance = self.get_grievance(grievance_id)
        staff = (
            self.db.query(Staff)
            .filter(Staff.user_id == staff_user_id)
            .first()
        )
        if not staff:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Faculty access required",
            )
        if grievance.assigned_to_id != staff.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Grievance assigned to another faculty",
            )
        return grievance

    def admin_close(self, grievance_id: int, payload: GrievanceStatusUpdate) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        grievance.status = "closed_by_admin"
        grievance.resolution_notes = payload.resolution_notes

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def update_grievance(self, grievance_id: int, payload: GrievanceUpdate) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        if payload.subject is not None:
            grievance.subject = payload.subject
        if payload.description is not None:
            grievance.description = payload.description
        if payload.attachment_url is not None:
            grievance.attachment_url = payload.attachment_url

        self.db.commit()
        self.db.refresh(grievance)
        return grievance

    def delete_grievance(self, grievance_id: int) -> None:
        grievance = self.get_grievance(grievance_id)
        self.db.delete(grievance)
        self.db.commit()
