from sqlalchemy import (
    Column, String, Integer, Date,
    Boolean, DateTime, JSON, Enum, 
    ForeignKey)
from sqlalchemy.orm import relationship
from src.db.session import Base
from datetime import datetime
from src.utils.enum import EmploymentTypeEnum, FacultyStatusEnum
from sqlalchemy import Column, Integer, String, Date, Float, Enum, Text, ForeignKey

class Staff(Base):
    __tablename__ = 'staff'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # link to user table
    employee_id = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    dob = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    faculty = Column(String(30), default=False)
    department_code = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String(100), nullable=True)
    qualification = Column(String(150), nullable=True)
    specialization = Column(String(150), nullable=True)
    joining_date = Column(Date, nullable=True)
    experience_years = Column(Float, nullable=True, default=0.0)
    employment_type = Column(String(20), nullable=False, default="Internal")
    status = Column(Enum(FacultyStatusEnum, name="facultystatusenum", create_type=False), nullable=False, default=FacultyStatusEnum.active.value)
    role = Column(Integer, ForeignKey("groups.id"), nullable=True)

    user = relationship("User", back_populates="staff", uselist=False)
    department = relationship("Department", back_populates="staff")
    entered_marks = relationship("MarksEntry", back_populates="staff")
