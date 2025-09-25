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

class FacultyBase(BaseModel):
    employee_id: Optional[str] = Field(None, description="Employee / staff id")
    department: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    experience_years: Optional[float] = None
    employment_type: Optional[EmploymentTypeEnum] = None
    research_area: Optional[str] = None
    publications_count: Optional[int] = None
    status: Optional[FacultyStatusEnum] = FacultyStatusEnum.active
    gender: Optional[GenderEnum] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = None
    profile_photo: Optional[str] = None

class FacultyCreate(FacultyBase):
    id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

    class Config:
        from_attributes = True

class FacultyResponse(BaseModel):
    faculty: FacultyCreate
    generated_password: str

    class Config:
        orm_mode = True
