from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from src.models.base import AuditableBase


class Grievance(AuditableBase):
    __tablename__ = "grievances"

    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=True)
    mobile_number = Column(String(20), nullable=True)
    category = Column(String(50), nullable=False, default="general")
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="open")
    attachment_url = Column(Text, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    assigned_to_id = Column(Integer, ForeignKey("staff.id"), nullable=True)

    student = relationship("Student", backref="grievances")
    assigned_to = relationship("Staff", backref="assigned_grievances")
    history = relationship("GrievanceHistory", back_populates="grievance", cascade="all, delete-orphan")

    @property
    def assigned_to_name(self):
        if self.assigned_to:
            return f"{self.assigned_to.first_name} {self.assigned_to.last_name}"
        return None


class GrievanceHistory(AuditableBase):
    __tablename__ = "grievance_history"

    grievance_id = Column(Integer, ForeignKey("grievances.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False)
    resolved_by_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    grievance = relationship("Grievance", back_populates="history")
    resolved_by = relationship("Staff", backref="resolved_grievances")