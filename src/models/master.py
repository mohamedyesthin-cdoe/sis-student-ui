from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.sql import func
from src.db.session import Base
from src.models.base import AuditableBase
from sqlalchemy.orm import relationship 

class Programe(AuditableBase):
    __tablename__ = "programs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    programe = Column(String(100), nullable=False, unique=True, index=True)
    short_name = Column(String(20), nullable=True)
    programe_code = Column(String(50), nullable=False, unique=True)
    duration = Column(String(20), nullable=True)
    category = Column(String(50), nullable=True)
    faculty = Column(String(100), nullable=True)
    application_code = Column(String(30), nullable=True)
    batch = Column(String(10))
    admission_year = Column(String(10))
    
    fee = relationship("FeeDetails", back_populates="programe")
    syllabuses = relationship("Subjects", back_populates="programe")
    schemes = relationship("Scheme", back_populates="programe")
    #student = relationship("Student", back_populates="program")

class FeeDetails(AuditableBase):
    __tablename__ = "fee_details"

    id = Column(Integer, primary_key=True, index=True)
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

class CourseCategory(AuditableBase):
    __tablename__ = "course_category"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)

    syllabuses = relationship("Subjects", back_populates="course_category")

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
    course_category_id = Column(Integer, ForeignKey("course_category.id"), nullable=False, index=True)
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
    course_category = relationship("CourseCategory", back_populates="syllabuses")
    course_title = relationship("CourseTitle", back_populates="syllabuses")
    programe = relationship("Programe", back_populates='syllabuses')
    marksheets = relationship("Marksheet", back_populates="subject")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, unique=True, nullable=True)

    staff = relationship("Staff", back_populates="department")