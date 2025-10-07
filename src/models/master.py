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
    
    fee = relationship("FeeDetails", back_populates="programe")
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