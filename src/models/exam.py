from sqlalchemy import (
    Column, Integer, String, ForeignKey, Boolean, 
    DECIMAL, DateTime, Date, Enum, UniqueConstraint, Time,
    Float
)
from datetime import datetime
from sqlalchemy.orm import relationship
from src.db.session import Base
from src.models.base import AuditableBase
from sqlalchemy.sql import func
from src.utils.enum import ExamStatus, ExamType

#Exam Models
class Exam(AuditableBase):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, autoincrement=True)

    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)

    exam_name = Column(String(100), nullable=False)
    exam_type = Column(String(50), nullable=False)
    month_year = Column(String(20), nullable=False)
    is_published = Column(Boolean, default=False)

    scheme = relationship("Scheme", back_populates="exams")
    semester = relationship("Semester", back_populates="exams")

    timetable = relationship("ExamTimeTable", back_populates="exam")
    registrations = relationship("StudentExamRegistration", back_populates="exam")
    marks_entries = relationship("MarksEntry", back_populates="exam")
    course_results = relationship("CourseResult", back_populates="exam")
    semester_results = relationship("SemesterResult", back_populates="exam")

class ExamTimeTable(AuditableBase):
    __tablename__ = "exam_timetables"

    id = Column(Integer, primary_key=True, autoincrement=True)

    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("course_components.id"), nullable=False)

    exam_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    exam = relationship("Exam", back_populates="timetable")
    course = relationship("Course", back_populates="exam_timetables")
    component = relationship("CourseComponent", back_populates="exam_timetables")

    __table_args__ = (
        UniqueConstraint("exam_id", "component_id", name="uq_exam_component"),
    )

#Student exam registration and marks entry models
class StudentExamRegistration(AuditableBase):
    __tablename__ = "student_exam_registrations"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)

    is_eligible = Column(Boolean, default=True)
    registered_on = Column(DateTime, default=datetime.utcnow)

    exam = relationship("Exam", back_populates="registrations")
    student = relationship("Student", back_populates="exam_registrations")
    semester = relationship("Semester", back_populates="exam_registrations")
    scheme = relationship("Scheme", back_populates="exam_registrations")

    courses = relationship("StudentCourseRegistration", back_populates="exam_registration")

    __table_args__ = (
        UniqueConstraint("student_id", "exam_id", name="uq_student_exam"),
    )

class StudentCourseRegistration(AuditableBase):
    __tablename__ = "student_course_registrations"

    id = Column(Integer, primary_key=True)

    student_exam_registration_id = Column(
        Integer,
        ForeignKey("student_exam_registrations.id"),
        nullable=False
    )
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("course_components.id"), nullable=False)

    is_arrear = Column(Boolean, default=False)
    permitted = Column(Boolean, default=True)
        
    exam_registration = relationship("StudentExamRegistration", back_populates="courses")
    course = relationship("Course", back_populates="student_registrations")
    component = relationship("CourseComponent", back_populates="student_registrations")

    __table_args__ = (
        UniqueConstraint(
            "student_exam_registration_id",
            "course_id",
            name="uq_student_exam_course"
        ),
    )

# --- Result Models ---
class MarksEntry(AuditableBase):
    __tablename__ = "marks_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("course_components.id"), nullable=False)

    marks_obtained = Column(Float, nullable=False)

    entered_by = Column(Integer, ForeignKey("staff.id"), nullable=False)
    is_locked = Column(Boolean, default=False)

    student = relationship("Student", back_populates="marksheets")
    exam = relationship("Exam", back_populates="marks_entries")
    course = relationship("Course", back_populates="marks_entries")
    component = relationship("CourseComponent", back_populates="marks_entries")
    staff = relationship("Staff", back_populates="entered_marks")

    __table_args__ = (
        UniqueConstraint(
            "student_id", "exam_id", 
            "course_id", "component_id",
            name="uq_student_exam_component"
        ),
    )

class CourseResult(AuditableBase):
    __tablename__ = "course_results"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("course_components.id"), nullable=False)

    total_marks = Column(Integer, nullable=False)
    result_status = Column(String(20), nullable=False)   # PASS / FAIL
    percentage = Column(Integer)
    grade = Column(String(5), nullable=True)
    grade_point = Column(Integer, nullable=True)

    result_version = Column(Integer, default=1)
    computed_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="course_results")
    exam = relationship("Exam", back_populates="course_results")
    course = relationship("Course", back_populates="course_results")
    component = relationship("CourseComponent", back_populates="component_results")

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "exam_id",
            "course_id",
            "result_version",
            name="uq_course_result_version"
        ),
    )

class SemesterResult(AuditableBase):
    __tablename__ = "semester_results"

    id = Column(Integer, primary_key=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)

    total_credits = Column(Integer, nullable=False)
    earned_credits = Column(Integer, nullable=False)

    sgpa = Column(Float, nullable=False)
    result_status = Column(String(20), nullable=False)   # PASS / FAIL

    student = relationship("Student", back_populates="semester_results")
    exam = relationship("Exam", back_populates="semester_results")
    semester = relationship("Semester", back_populates="semester_results")

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "exam_id",
            "semester_id",
            name="uq_semester_result_version"
        ),
    )
