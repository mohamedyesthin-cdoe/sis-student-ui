from pydantic import BaseModel, EmailStr, StringConstraints, validator, Field, HttpUrl, constr
from typing import Optional, List, Annotated
from datetime import date, datetime
import re
from enum import Enum
from src.schemas.address import AddressCreate, AddressResponse
from src.utils.enum import EmploymentTypeEnum, FacultyStatusEnum, GenderEnum
from typing_extensions import Annotated
from src.schemas.master import DepartmentOut

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
    employee_id: str = Field(..., min_length=3, max_length=15)
    first_name: str = Field(..., min_length=1, max_length=30)
    last_name: str = Field(..., min_length=1, max_length=30)
    email: EmailStr
    phone: Optional[str] = Field(
        ..., min_length=7, max_length=15, 
        description="Phone number must be between 7 and 15 digits")
    dob: Optional[date] = None
    gender: Optional[str] = None
    faculty: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    experience_years: Optional[float] = Field(default=0.0, ge=0.0)
    employment_type: EmploymentTypeEnum = EmploymentTypeEnum.internal
    status: FacultyStatusEnum = FacultyStatusEnum.active
    role: Optional[int] = None

    @validator('phone')
    def validate_phone(cls, v):
        if v:
            pattern = re.compile(r'^\+?\d{7,15}$')
            if not pattern.match(v):
                raise ValueError('Invalid phone number format')
        return v

class StaffCreate(StaffBase):
    id: int
    user_id: Optional[int] = None
    department: Optional[DepartmentOut] = None

    class Config:
        from_attributes = True

class StaffResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: StaffCreate = None

class StaffDeleteResponse(BaseModel):
    message: str
    code: int
    status: bool

class StaffListResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: List[StaffCreate] = []

class StaffUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    #email: Optional[EmailStr] = None
    #phone: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    faculty: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    joining_date: Optional[date] = None
    experience_years: Optional[float] = None
    employment_type: Optional[EmploymentTypeEnum] = None
    status: Optional[FacultyStatusEnum] = None
    role: Optional[str] = None

class StaffUpdateResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: Optional[StaffUpdate] = None
