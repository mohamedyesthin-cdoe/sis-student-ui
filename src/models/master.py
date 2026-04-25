from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.sql import func
from src.db.session import Base
from src.models.base import AuditableBase
from sqlalchemy.orm import relationship 

class Programe(AuditableBase):
    __tablename__ = "programs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    department_code = Column(String(50), nullable=True, index=True)
    programe = Column(String(100), nullable=False, unique=True, index=True)
    short_name = Column(String(20), nullable=True)
    programe_code = Column(String(50), nullable=False, unique=True)
    duration = Column(String(20), nullable=True)
    category = Column(String(50), nullable=True)
    application_code = Column(String(30), nullable=True)
    batch = Column(String(10))
    academic_year = Column(String(10))
    pending_payment_workflow_enabled = Column(Boolean, default=False, nullable=False)
    
    fee = relationship("FeeDetails", back_populates="programe")
    pending_payment_workflow_scopes = relationship(
        "ProgramPaymentWorkflowScope",
        back_populates="program",
        cascade="all, delete-orphan"
    )
    syllabuses = relationship("Subjects", back_populates="programe")
    semesters = relationship(
        "Semester",
        back_populates="program",
        cascade="all, delete-orphan",
    )
    department = relationship("Department", back_populates="programs")
    #batches = relationship("Batch", back_populates="programe")
    #student = relationship("Student", back_populates="program")

class FeeDetails(AuditableBase):
    __tablename__ = "fee_details"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    programe_id = Column(Integer, ForeignKey("programs.id"))
    semester = Column(String)
    application_fee = Column(String, nullable=True)
    admission_fee = Column(String, nullable=True)
    tuition_fee = Column(String, nullable=True)
    exam_fee = Column(String, nullable=True)
    lms_fee = Column(String, nullable=True)
    lab_fee = Column(String, nullable=True)
    total_fee = Column(String, nullable=True)

    programe = relationship("Programe", back_populates="fee")

class Category(AuditableBase):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    lookups = relationship("LookupMaster", back_populates="category")

class SscBoard(AuditableBase):
    __tablename__ = "ssc_board"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    academic_details_10th = relationship("AcademicDetails", back_populates="ssc_board")

class HscBoard(AuditableBase):
    __tablename__ = "hsc_board"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    academic_details_12th = relationship("AcademicDetails", back_populates="hsc_board")

class LookupMaster(AuditableBase):
    __tablename__ = "lookup_master"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(10), nullable=False, unique=True, index=True)
    values = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)

    category = relationship("Category", back_populates="lookups")

class CourseCode(AuditableBase):
    __tablename__ = "course_code"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), nullable=False, unique=True, index=True)

    syllabuses = relationship("Subjects", back_populates="course_code")

class MasterCourseCategory(AuditableBase):
    __tablename__ = "master_course_category"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)

    syllabuses = relationship("Subjects", back_populates="master_course_category")

class CourseTitle(AuditableBase):
    __tablename__ = "course_title"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, unique=True, index=True)

    syllabuses = relationship("Subjects", back_populates="course_title")

class Subjects(AuditableBase):     
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, autoincrement=True)

    programe_id = Column(Integer, ForeignKey("programs.id"), nullable=True, index=True)
    course_code_id = Column(Integer, ForeignKey("course_code.id"), nullable=False, index=True)
    master_course_category_id = Column(Integer, ForeignKey("master_course_category.id"), nullable=False, index=True)
    course_title_id = Column(Integer, ForeignKey("course_title.id"), nullable=False, index=True)

    semester = Column(String(50), nullable=False, index=True)  # ✔ removed unique=True

    credits = Column(Integer, nullable=False)
    tutorial_hours = Column(Integer, default=0)
    lecture_hours = Column(Integer, default=0)
    practical_hours = Column(Integer, default=0)
    total_hours = Column(Integer, default=0)

    cia = Column(Integer, default=0)
    esa = Column(Integer, default=0)
    total_marks = Column(Integer, default=0)

    course_code = relationship("CourseCode", back_populates="syllabuses")
    master_course_category = relationship("MasterCourseCategory", back_populates="syllabuses")
    course_title = relationship("CourseTitle", back_populates="syllabuses")
    programe = relationship("Programe", back_populates='syllabuses')
    #marksheets = relationship("Marksheet", back_populates="subject")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, unique=True, nullable=True)
    department_code = Column(String(50), unique=True, nullable=True, index=True)

    staff = relationship("Staff", back_populates="department")
    programs = relationship("Programe", back_populates="department")


class ProgramPaymentWorkflowScope(AuditableBase):
    __tablename__ = "program_payment_workflow_scopes"

    program_id = Column(Integer, ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    batch = Column(String(20), nullable=False)
    admission_year = Column(String(20), nullable=False)
    semester = Column(String(20), nullable=False)
    enabled = Column(Boolean, default=False, nullable=False)

    program = relationship("Programe", back_populates="pending_payment_workflow_scopes")


class AcademicYear(AuditableBase):
    __tablename__ = "academic_years"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year_code = Column(String(20), nullable=False, unique=True, index=True)  # e.g., "2025-26"
    start_year = Column(Integer, nullable=False)  # e.g., 2025
    end_year = Column(Integer, nullable=False)  # e.g., 2026
    start_month = Column(Integer, nullable=False, default=7)  # July
    end_month = Column(Integer, nullable=False, default=6)  # June
    is_active = Column(Boolean, default=False, nullable=False)
    description = Column(String(255), nullable=True)

    batches = relationship("Batch", back_populates="academic_year", cascade="all, delete-orphan")


class Batch(AuditableBase):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    academic_year_id = Column(Integer, ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_number = Column(Integer, nullable=False)  # e.g., 1, 2
    batch_name = Column(String(100), nullable=False)  # e.g., "Batch 1 (July-Dec)"
    start_month = Column(Integer, nullable=False)  # e.g., 7
    end_month = Column(Integer, nullable=False)  # e.g., 12
    is_active = Column(Boolean, default=False, nullable=False)
    description = Column(String(255), nullable=True)

    academic_year = relationship("AcademicYear", back_populates="batches")


class SemesterMaster(AuditableBase):
    __tablename__ = "semester_masters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    program_type = Column(String(50), nullable=False, index=True)  # e.g., "UG", "PG"
    semester_number = Column(Integer, nullable=False)  # e.g., 1, 2, 3...
    semester_name = Column(String(100), nullable=False)  # e.g., "Semester 1", "Semester 2"
    is_active = Column(Boolean, default=True, nullable=False)
    description = Column(String(255), nullable=True)

    __table_args__ = (UniqueConstraint('program_type', 'semester_number', name='uq_program_type_semester'),)
