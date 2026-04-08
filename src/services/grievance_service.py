from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from src.models.students import Student
from src.models.master import Programe
from src.models.grievance import Grievance
from src.schemas.grievance import (
    GrievanceCreate,
    GrievanceStatusUpdate,
    GrievanceUpdate,
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

    def list_grievances_with_details(self) -> List[dict]:
        query = (
            self.db.query(Grievance, Student, Programe)
            .outerjoin(Student, Grievance.student_id == Student.id)
            .outerjoin(Programe, Student.program_id == Programe.id)
            .order_by(Grievance.created_at.desc())
        )

        results = []
        for grievance, student, program in query.all():
            results.append(
                {
                    "id": grievance.id,
                    "subject": grievance.subject,
                    "description": grievance.description,
                    "status": grievance.status,
                    "category": grievance.category,
                    "attachment_url": grievance.attachment_url,
                    "resolution_notes": grievance.resolution_notes,
                    "created_at": grievance.created_at,
                    "updated_at": grievance.updated_at,
                    "student_id": grievance.student_id,
                    "student_name": f"{student.first_name} {student.last_name}" if student else None,
                    "registration_no": student.registration_no if student else None,
                    "program_name": program.programe if program else None,
                }
            )
        return results

    def get_grievance(self, grievance_id: int) -> Grievance:
        grievance = self.db.query(Grievance).filter(Grievance.id == grievance_id).first()
        if not grievance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grievance not found",
            )
        return grievance

    def update_status(self, grievance_id: int, payload: GrievanceStatusUpdate) -> Grievance:
        grievance = self.get_grievance(grievance_id)

        grievance.status = payload.status
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
