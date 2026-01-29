from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DECIMAL, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from src.db.session import Base
from src.models.base import AuditableBase
from sqlalchemy.sql import func

class Marksheet(AuditableBase):
    __tablename__ = "marksheets"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    
    total_marks = Column(Integer, nullable=False)
    
    grade = Column(String(5), nullable=True)
    grade_point = Column(DECIMAL(3, 2))
    result = Column(String(10))
    
    semester = Column(String(20), nullable=False)
    academic_year = Column(String(20), nullable=False)
    is_locked = Column(Boolean, default=False)
    entered_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    student = relationship("Student", back_populates="marksheets")
    subject = relationship("Subjects", back_populates="marksheets") 
    entries = relationship("MarkEntry", back_populates="marksheets")
    entered_user = relationship("User")

class MarkEntry(AuditableBase):
    __tablename__ = "mark_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    marksheet_id = Column(Integer, ForeignKey("marksheets.id"), nullable=False)

    exam_type = Column(
        String(10), nullable=False
    )

    marks_obtained = Column(Integer, nullable=False)

    entered_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    entered_on = Column(DateTime, default=datetime.utcnow)

    is_locked = Column(Boolean, default=False)

    marksheets = relationship("Marksheet", back_populates="entries")
    entered_user = relationship("User")

