from pydantic import BaseModel, EmailStr, StringConstraints, validator, Field, HttpUrl, constr
from typing import Optional, List, Annotated
from datetime import date, datetime
import re
from enum import Enum
from src.schemas.address import AddressCreate, AddressResponse
from src.utils.enum import EmploymentTypeEnum, FacultyStatusEnum, GenderEnum
from typing_extensions import Annotated

class CountryCreate(BaseModel):
    name: str
    country_code: str

class CountryResponse(BaseModel):
    id: int
    name: str
    country_code: str

    class Config:
        from_attributes = True

class StateCreate(BaseModel):
    name: str
    country_id: int

class StateResponse(BaseModel):
    id: int
    country_id: int
    name: str

    class Config:
        from_attributes = True

class StaffBase(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    experience_years: Optional[float] = None
    employment_type: EmploymentTypeEnum = EmploymentTypeEnum.permanent
    research_area: Optional[str] = None
    publications_count: Optional[int] = 0
    status: FacultyStatusEnum = FacultyStatusEnum.active
    linkedin_url: Optional[str] = None
    profile_photo: Optional[str] = None
    role: Optional[int] = None

class StaffCreate(StaffBase):
    id: int
    user_id: Optional[int] = None

    class Config:
        from_attributes = True

class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    experience_years: Optional[float] = None
    employment_type: Optional[EmploymentTypeEnum] = None
    research_area: Optional[str] = None
    publications_count: Optional[int] = None
    status: Optional[FacultyStatusEnum] = None
    linkedin_url: Optional[HttpUrl] = None
    profile_photo: Optional[str] = None
    role: Optional[str] = None

class StaffResponse(BaseModel):
    id: int
    user_id: int

    class Config:
        from_attributes = True 
