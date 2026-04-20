from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, aliased
from src.models.students import Student
from src.models.master import Programe
from src.models.grievance import Grievance,GrievanceHistory
from src.models.staff import Staff
from src.schemas.grievance import (
    GrievanceCreate,
    GrievanceAdminClose,
    GrievanceStatusUpdate,
    GrievanceUpdate,
    GrievanceAssign,
    GrievanceFacultyClose,
    GrievanceFacultyStatusUpdate,
)


def _normalize_notes(value: Optional[str]) -> str:
    if value is None:
        return ""

    cleaned = value.strip()
    if not cleaned or cleaned.lower() == "string":
        return ""
    return cleaned


def _get_latest_faculty_note(db: Session, grievance_id: int) -> str:
    history = (
        db.query(GrievanceHistory)
        .filter(GrievanceHistory.grievance_id == grievance_id)
        .filter(GrievanceHistory.action.in_(["faculty_closed", "faculty_status_updated"]))
        .order_by(GrievanceHistory.created_at.desc())
        .all()
    )
    for record in history:
        note = _normalize_notes(record.notes)
        if note:
            return note
    return ""


def _resolve_resolution_notes(
    db: Session,
    grievance: Grievance,
    history_entries: Optional[List[dict]] = None,
) -> str:
    direct_notes = _normalize_notes(grievance.resolution_notes)
    if grievance.status != "closed_by_admin":
        return direct_notes

    if direct_notes:
        return direct_notes

    if history_entries is not None:
        for entry in history_entries:
            if entry.get("action") in {"faculty_closed", "faculty_status_updated"}:
                note = _normalize_notes(entry.get("notes"))
                if note:
                    return note

    faculty_note = _get_latest_faculty_note(db, grievance.id)
    if faculty_note:
        return faculty_note

    if history_entries is not None:
        for entry in history_entries:
            note = _normalize_notes(entry.get("notes"))
            if note:
                return note

    return ""


def _resolve_history_actor(grievance: Grievance, record) -> tuple[Optional[int], Optional[str]]:
    resolved_by_id = getattr(record, "resolved_by_id", None)
    resolved_by_name = None

    if getattr(record, "resolved_by", None):
        resolved_by_name = f"{record.resolved_by.first_name} {record.resolved_by.last_name}"
        return resolved_by_id or record.resolved_by.id, resolved_by_name

    if resolved_by_id:
        return resolved_by_id, None

    assigned_staff = getattr(grievance, "assigned_to", None)
    if assigned_staff:
        resolved_by_id = assigned_staff.id
        resolved_by_name = f"{assigned_staff.first_name} {assigned_staff.last_name}"

    return resolved_by_id, resolved_by_name


class GrievanceService:
    def __init__(self, db: Session):
        self.db = db

    def resolve_staff_for_user(self, user) -> Optional[Staff]:
        """
        Resolve the Staff row for an authenticated user.

        Some environments only populate one of these links, so we try the
        relationship first and then fall back to common staff identity fields.
        """
        if not user:
            return None

        staff = getattr(user, "staff", None)
        if staff:
            return staff

        user_id = getattr(user, "id", None)
        if user_id is not None:
            staff = self.db.query(Staff).filter(Staff.user_id == user_id).first()
            if staff:
                return staff

        email = getattr(user, "email", None)
        if email:
            staff = self.db.query(Staff).filter(Staff.email == email).first()
            if staff:
                return staff

        username = getattr(user, "username", None)
        if username:
            staff = self.db.query(Staff).filter(Staff.employee_id == username).first()
            if staff:
                return staff

        return None

    def create_grievance(self, data: GrievanceCreate) -> Grievance:
        grievance = Grievance(
            student_id=getattr(data, "student_id", None),
            student_name=getattr(data, "student_name", None) or "Anonymous",
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
                    "resolution_notes": _resolve_resolution_notes(self.db, grievance),
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
        for grievance, student, programe in query.all():
            # Get grievance history
            history = (
                self.db.query(GrievanceHistory)
                .filter(GrievanceHistory.grievance_id == grievance.id)
                .order_by(GrievanceHistory.created_at.desc())
                .all()
            )

            history_list = []
            for record in history:
                resolved_by_id, resolved_by_name = _resolve_history_actor(grievance, record)

                history_list.append({
                    "action": record.action,
                    "status": record.status,
                    "resolved_by_id": resolved_by_id,
                    "resolved_by_name": resolved_by_name,
                    "notes": _normalize_notes(record.notes),
                    "created_at": (
                        record.created_at.isoformat()
                        if getattr(record, "created_at", None)
                        else (
                            record.timestamp.isoformat()
                            if getattr(record, "timestamp", None)
                            else None
                        )
                    ),
                })
        
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
                    "resolution_notes": _resolve_resolution_notes(self.db, grievance, history_list),
                    "created_at": grievance.created_at,
                    "updated_at": grievance.updated_at,
                    "history": history_list,
                }
            )
        return flat_list
    
    def get_grievance_with_details(self, grievance_id: int) -> dict:
        record = (
            self.db.query(Grievance, Student, Programe)
            .outerjoin(Student, Grievance.student_id == Student.id)
            .outerjoin(Programe, Student.program_id == Programe.id)
            .filter(Grievance.id == grievance_id)
            .first()
        )
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Grievance not found",
            )

        grievance, student, _program = record
        
        # Get grievance history
        history = (
            self.db.query(GrievanceHistory)
            .filter(GrievanceHistory.grievance_id == grievance_id)
            .order_by(GrievanceHistory.created_at.desc())
            .all()
        )
        
        history_list = []
        for record in history:
            resolved_by_id, resolved_by_name = _resolve_history_actor(grievance, record)
            
            history_list.append({
                "action": record.action,
                "status": record.status,
                "resolved_by_id": resolved_by_id,
                "resolved_by_name": resolved_by_name,
                "notes": _normalize_notes(record.notes),
                "created_at": (
                    record.created_at.isoformat()
                    if getattr(record, "created_at", None)
                    else (
                        record.timestamp.isoformat()
                        if getattr(record, "timestamp", None)
                        else None
                    )
                ),
            })
        
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
            "resolution_notes": _resolve_resolution_notes(self.db, grievance, history_list),
            "created_at": grievance.created_at,
            "updated_at": grievance.updated_at,
            "history": history_list,
        }
    
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
            "resolution_notes": _resolve_resolution_notes(self.db, grievance),
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

    def assign_grievance(self, grievance_id: int, payload: GrievanceAssign) -> dict:
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
        return self.get_grievance_with_details(grievance_id)

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

    def faculty_update_status(self, grievance_id: int, staff_user_id: int, payload: GrievanceFacultyStatusUpdate) -> dict:
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

        # Auto-set status to 'resolved' if resolution_notes are provided
        if payload.resolution_notes:
            grievance.status = "resolved"
        else:
            grievance.status = payload.status
        
        grievance.resolution_notes = payload.resolution_notes

        self.db.commit()
        self.db.refresh(grievance)

        # Get student and assigned staff info
        student = None
        if grievance.student_id:
            student = self.db.query(Student).filter(Student.id == grievance.student_id).first()

        student_name = None
        registration_no = None
        if student:
            first = getattr(student, "first_name", "") or ""
            last = getattr(student, "last_name", "") or ""
            student_name = (first + " " + last).strip() or None
            registration_no = getattr(student, "registration_no", None)

        assigned_staff = None
        if grievance.assigned_to_id:
            assigned_staff = self.db.query(Staff).filter(Staff.id == grievance.assigned_to_id).first()

        assigned_to_name = None
        if assigned_staff:
            first = getattr(assigned_staff, "first_name", "") or ""
            last = getattr(assigned_staff, "last_name", "") or ""
            assigned_to_name = (first + " " + last).strip() or getattr(assigned_staff, "name", None)

        return {
            "id": grievance.id,
            "student_id": grievance.student_id,
            "student_name": student_name,
            "registration_no": registration_no,
            "status": grievance.status,
            "assigned_to_id": grievance.assigned_to_id,
            "assigned_to_name": assigned_to_name,
            "subject": grievance.subject,
            "description": grievance.description,
            "attachment_url": grievance.attachment_url,
            "resolution_notes": grievance.resolution_notes,
            "created_at": grievance.created_at.isoformat() if getattr(grievance, "created_at", None) else None,
            "updated_at": grievance.updated_at.isoformat() if getattr(grievance, "updated_at", None) else None,
        }
    
    def list_for_faculty(self, staff_user_id: int) -> List[dict]:
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

        AssignedStaff = aliased(Staff)

        query = (
            self.db.query(Grievance, Student, AssignedStaff)
            .outerjoin(Student, Grievance.student_id == Student.id)
            .outerjoin(AssignedStaff, Grievance.assigned_to_id == AssignedStaff.id)
            .filter(Grievance.assigned_to_id == staff.id)
            .order_by(Grievance.created_at.desc())
        )

        results: List[dict] = []
        for grievance, student, assigned in query.all():
            # build student_name and registration_no
            student_name = None
            registration_no = None
            if student:
                first = getattr(student, "first_name", "") or ""
                last = getattr(student, "last_name", "") or ""
                student_name = (first + " " + last).strip() or None
                registration_no = getattr(student, "registration_no", None)

            # build assigned_to_name
            assigned_to_name = None
            if assigned:
                first = getattr(assigned, "first_name", "") or ""
                last = getattr(assigned, "last_name", "") or ""
                assigned_to_name = (first + " " + last).strip() or getattr(assigned, "name", None)

            results.append(
                {
                    "id": grievance.id,
                    "student_id": grievance.student_id,
                    "student_name": student_name,
                    "registration_no": registration_no,
                    "status": grievance.status,
                    "assigned_to_id": grievance.assigned_to_id,
                    "assigned_to_name": assigned_to_name,
                    "subject": grievance.subject,
                    "description": grievance.description,
                    "attachment_url": grievance.attachment_url,
                    "resolution_notes": _resolve_resolution_notes(self.db, grievance),
                    "created_at": grievance.created_at.isoformat() if getattr(grievance, "created_at", None) else None,
                    "updated_at": grievance.updated_at.isoformat() if getattr(grievance, "updated_at", None) else None,
                }
            )

        return results
    
    def get_for_faculty(self, grievance_id: int, staff_user_id: int) -> dict:
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

        # student info
        student = None
        if getattr(grievance, "student_id", None):
            student = self.db.query(Student).filter(Student.id == grievance.student_id).first()

        student_name = None
        registration_no = None
        if student:
            first = getattr(student, "first_name", "") or ""
            last = getattr(student, "last_name", "") or ""
            student_name = (first + " " + last).strip() or None
            registration_no = getattr(student, "registration_no", None)

        # assigned_to name
        assigned_staff = None
        if grievance.assigned_to_id:
            assigned_staff = self.db.query(Staff).filter(Staff.id == grievance.assigned_to_id).first()

        assigned_to_name = None
        if assigned_staff:
            first = getattr(assigned_staff, "first_name", "") or ""
            last = getattr(assigned_staff, "last_name", "") or ""
            assigned_to_name = (first + " " + last).strip() or getattr(assigned_staff, "name", None)

        return {
            "id": grievance.id,
            "student_id": grievance.student_id,
            "student_name": student_name,
            "registration_no": registration_no,
            "status": grievance.status,
            "assigned_to_id": grievance.assigned_to_id,
            "assigned_to_name": assigned_to_name,
            "subject": grievance.subject,
            "description": grievance.description,
            "attachment_url": grievance.attachment_url,
            "resolution_notes": _resolve_resolution_notes(self.db, grievance),
            "created_at": grievance.created_at.isoformat() if getattr(grievance, "created_at", None) else None,
            "updated_at": grievance.updated_at.isoformat() if getattr(grievance, "updated_at", None) else None,
        }

    def admin_close(
        self,
        grievance_id: int,
        payload: Optional[GrievanceAdminClose] = None,
        resolved_by_id: Optional[int] = None,
    ) -> dict:
        grievance = self.get_grievance(grievance_id)
        faculty_note = _normalize_notes(grievance.resolution_notes) or _get_latest_faculty_note(self.db, grievance_id)
        resolved_by_id = resolved_by_id or grievance.assigned_to_id
        grievance.status = "closed_by_admin"

        # Log history
        history = GrievanceHistory(
            grievance_id=grievance_id,
            action="closed",
            status="closed_by_admin",
            resolved_by_id=resolved_by_id,
            notes=faculty_note,
            timestamp=datetime.utcnow(),
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(grievance)

        # Fetch student details to build response
        student = None
        if grievance.student_id:
            student = self.db.query(Student).filter(Student.id == grievance.student_id).first()
        
        student_name = None
        registration_no = None
        if student:
            student_name = f"{student.first_name} {student.last_name}"
            registration_no = student.registration_no

        assigned_to_name = None
        if grievance.assigned_to:
            assigned_to_name = f"{grievance.assigned_to.first_name} {grievance.assigned_to.last_name}"
    
        return {
            "id": grievance.id,
            "student_id": grievance.student_id,
            "student_name": student_name,
            "registration_no": registration_no,
            "status": grievance.status,
            "assigned_to_id": grievance.assigned_to_id,
            "assigned_to_name": assigned_to_name,
            "subject": grievance.subject,
            "description": grievance.description,
            "attachment_url": grievance.attachment_url,
            "resolution_notes": faculty_note,
            "created_at": grievance.created_at,
            "updated_at": grievance.updated_at,
        }

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

    def reissue_grievance(self, grievance_id: int, reason: Optional[str] = None) -> dict:
        """Reissue a closed/resolved grievance back to open status"""
        grievance = self.get_grievance(grievance_id)

        # Only allow reissuing closed or resolved grievances
        if grievance.status not in ["closed_by_admin", "closed_by_faculty", "resolved"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot reissue grievance with status '{grievance.status}'",
            )

        # Log history before reissuing
        history = GrievanceHistory(
            grievance_id=grievance_id,
            action="reissued",
            status=grievance.status,
            notes=reason or "Reissued by student",
            timestamp=datetime.utcnow(),
        )
        self.db.add(history)

        # Reset grievance to open
        grievance.status = "open"
        grievance.resolution_notes = reason or f"Reissued from {grievance.status}"
        grievance.assigned_to_id = None  # Clear assignment

        self.db.commit()
        self.db.refresh(grievance)

        return self.get_grievance_public(grievance_id)
