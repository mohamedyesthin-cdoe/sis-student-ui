from sqlalchemy import (
    CheckConstraint, Column, DateTime, String, Integer, Enum, Date,
    ForeignKey, Index, func, Boolean, Text
)
from src.db.session import Base
from src.models.address import Country
from sqlalchemy.orm import relationship
from src.models.base import AuditableBase
from datetime import datetime
from src.models.master import Programe

class Student(AuditableBase):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Program Details
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)

    # Personal Info
    application_no = Column(String(20), unique=True, nullable=True)
    registration_no = Column(String, unique=True, nullable=True)
    title = Column(String(10), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    gender = Column(String(10), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    blood_group = Column(String(10), nullable=True)

    # Contact
    email = Column(String(100), unique=True, nullable=False)
    mobile_number = Column(String(15), unique=True, nullable=False)
    alternative_phone = Column(String(15), nullable=True)
    whatsapp_number = Column(String(15), nullable=False)
    
    # Demographics
    marital_status = Column(String(10), nullable=False)
    religion = Column(String(20), nullable=False)
    nationality = Column(String(30), nullable=False)
    
    # Caste/Category
    category = Column(String(10), nullable=False)
    caste = Column(String(50), nullable=True)
    
    # Documents
    aadhaar_number = Column(String(12), unique=True)
    pan_number = Column(String(10), unique=True)

    # Family Info
    parent_guardian_name = Column(String(100), nullable=False)
    relationship_with_student = Column(String(50), nullable=False)
    
    # Employment/Financial
    current_employment = Column(String(100), nullable=True)
    annual_income = Column(String(20), nullable=True)
    locality = Column(String(10), nullable=True)

    # Passport Details
    passport_issued_country = Column(String(30), nullable=True)
    passport_number = Column(String(20), nullable=True)
    passport_expiry_date = Column(Date, nullable=True)

    batch = Column(String(10), nullable=True)
    admission_year = Column(String(10), nullable=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=True)  # Optional semester association
    
    # Soft Delete (optional)
    is_deleted = Column(Boolean, default=False)
    is_pushed = Column(Boolean, default=False)
    is_pushed_digi = Column(Boolean, default=False)
    is_synced = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    #nationality_country = relationship("Country", back_populates="students_nationality")
    #nationality_country = relationship("Country", back_populates="students_nationality", foreign_keys=[nationality])
    programe = relationship("Programe", backref="students")
    address_details = relationship("AddressDetails", back_populates="student", uselist=False)
    academic_details = relationship("AcademicDetails", back_populates="student", uselist=False)
    document_details = relationship("DocumentDetails", back_populates="student", uselist=False)
    declaration_details = relationship("DeclarationDetails", back_populates="student", uselist=False)
    deb_details = relationship("DebDetails", back_populates="student", uselist=False)
    payments = relationship("Payment", back_populates="student", cascade="all, delete-orphan")
    marksheets = relationship("Marksheet", back_populates="student")
    exam_registrations = relationship("StudentExamRegistration", back_populates="student")
    marksheets = relationship("MarksEntry", back_populates="student")
    course_results = relationship("CourseResult", back_populates="student")
    semester_results = relationship("SemesterResult", back_populates="student")
    semester = relationship("Semester", back_populates="students")
    
    __table_args__ = (
        CheckConstraint("date_of_birth <= current_date - interval '18 years'", name="age_check"),
        Index("ix_students_phone", "mobile_number"),
        Index("ix_students_aadhaar", "aadhaar_number"),
        Index("ix_students_pan", "pan_number"),
        CheckConstraint("aadhaar_number ~ '^[0-9]{12}$' ", name="check_aadhaar_format"),
        CheckConstraint("pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$' ", name="check_pan_format"),
    )

class AddressDetails(Base):
    __tablename__ = "address_details"
    
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    
    # Correspondence Address
    corr_addr1 = Column(String(100), nullable=False)
    corr_addr2 = Column(String(100))
    corr_city = Column(String(30))  
    corr_state = Column(String(30))
    corr_district = Column(String(30))
    corr_country = Column(String(30), nullable=False)
    corr_pin = Column(String(10), nullable=False)
    corr_addr_same = Column(Boolean, default=True)
    # Permanent Address
    perm_addr1 = Column(String(100))
    perm_addr2 = Column(String(100))
    perm_city = Column(String(30))
    perm_state = Column(String(30))
    perm_district = Column(String(30))
    perm_country = Column(String(30), nullable=False)
    perm_pin = Column(String(10))

    student = relationship("Student", back_populates="address_details")

class AcademicDetails(Base):
    __tablename__ = "academic_details"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    ssc_board_id = Column(Integer, ForeignKey("ssc_board.id"))
    ssc_school = Column(String(100), nullable=False)
    ssc_scheme = Column(String(30), nullable=False)
    ssc_score = Column(String(10), nullable=False)
    ssc_year = Column(Date, nullable=False)
    after_ssc = Column(String(20), nullable=False)
    hsc_board_id = Column(Integer, ForeignKey("hsc_board.id"))
    hsc_school = Column(String(100))
    hsc_result = Column(String(20))
    hsc_scheme = Column(String(30))
    hsc_score = Column(String(10))
    hsc_year = Column(Date)
    diploma_institute = Column(String(100), nullable=False)
    diploma_board = Column(String(100), nullable=False)
    diploma_result = Column(String(20), nullable=False)
    diploma_scheme = Column(String(30), nullable=False)
    diploma_score = Column(String(10), nullable=False)
    diploma_year = Column(Date, nullable=True)

    student = relationship("Student", back_populates="academic_details")
    ssc_board = relationship("SscBoard", back_populates="academic_details_10th")
    hsc_board = relationship("HscBoard", back_populates="academic_details_12th")

class DocumentDetails(Base):
    __tablename__ = "document_details"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    class_10th_marksheet = Column(Text)  # Cloud file URL/path
    class_12th_marksheet = Column(Text)
    graduation_marksheet = Column(Text)
    diploma_marksheet = Column(Text)
    work_experience_certificates = Column(Text)
    passport = Column(Text)
    aadhar = Column(Text)
    signature = Column(Text)
    profile_image = Column(Text)

    student = relationship("Student", back_populates="document_details")

class DeclarationDetails(Base):
    __tablename__ = "declaration_details"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    declaration_agreed = Column(Boolean, nullable=False)
    applicant_name = Column(String(100), nullable=False)
    parent_name = Column(String(100))
    declaration_date = Column(Date, nullable=False)
    place = Column(String(100), nullable=False)

    student = relationship("Student", back_populates="declaration_details")

class DebDetails(Base):
    __tablename__ = "deb_details"
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False, unique=True)
    deb_id = Column(String(80), nullable=False)
    deb_name = Column(String)
    deb_gender = Column(String)
    deb_date_of_birth = Column(String)
    deb_university = Column(String)
    deb_program = Column(String)
    deb_abcid = Column(String)
    deb_details_1 = Column(String)
    deb_details_2 = Column(String)
    deb_details_3 = Column(String)
    deb_details_4 = Column(String)
    deb_details_5 = Column(String)
    deb_details_6 = Column(String)
    deb_details_7 = Column(String)
    deb_details_8 = Column(String)
    deb_details_9 = Column(String)
    deb_details_10 = Column(String)
    deb_details_11 = Column(String)
    deb_details_12 = Column(String)
    deb_details_13 = Column(String)
    deb_details_14 = Column(String)
    deb_details_15 = Column(String)
    deb_status = Column(String)

    student = relationship("Student", back_populates="deb_details")