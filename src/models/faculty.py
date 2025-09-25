from sqlalchemy import (
    Column, String, Integer, Date,
    Boolean, DateTime, JSON, Enum, 
    ForeignKey)
from sqlalchemy.orm import relationship
from src.db.session import Base
from datetime import datetime
from src.utils.enum import EmploymentTypeEnum, FacultyStatusEnum
from sqlalchemy import Column, Integer, String, Date, Float, Enum, Text, ForeignKey

class Faculty(Base):
    __tablename__ = 'faculty'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # independent faculty id
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)  # link to user table
    employee_id = Column(String(50), unique=True, nullable=False)
    dob = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)
    department = Column(String(100), nullable=False)
    designation = Column(String(100), nullable=True)
    qualification = Column(String(150), nullable=True)
    specialization = Column(String(150), nullable=True)
    joining_date = Column(Date, nullable=True)
    experience_years = Column(Float, nullable=True)
    employment_type = Column(Enum(EmploymentTypeEnum), nullable=False, default=EmploymentTypeEnum.permanent)
    research_area = Column(Text, nullable=True)
    publications_count = Column(Integer, nullable=True, default=0)
    status = Column(Enum(FacultyStatusEnum), nullable=False, default=FacultyStatusEnum.active)
    linkedin_url = Column(String(200), nullable=True)
    profile_photo = Column(String(200), nullable=True)

    user = relationship("User", backref="faculty", uselist=False)