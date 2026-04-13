from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class GrievanceBase(BaseModel):
    subject: str = Field(..., max_length=255)
    description: str
    attachment_url: Optional[str] = None
    student_id: Optional[int] = None


class GrievanceCreate(GrievanceBase):
    pass


class GrievanceUpdate(BaseModel):
    subject: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    attachment_url: Optional[str] = None


class GrievanceStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        max_length=30,
        description="open | in_progress | assigned | closed_by_faculty | closed_by_admin",
    )
    resolution_notes: Optional[str] = None


class GrievanceAssign(BaseModel):
    staff_id: int = Field(..., description="Staff (faculty) id to assign the grievance to")
    notes: Optional[str] = None


class GrievanceFacultyClose(BaseModel):
    resolution_notes: Optional[str] = None


class GrievanceFacultyStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        max_length=30,
        description="in_progress | closed_by_faculty",
    )
    resolution_notes: Optional[str] = None


class GrievanceResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    name: str
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    category: str
    subject: str
    description: str
    status: str
    attachment_url: Optional[str] = None
    resolution_notes: Optional[str] = None
    assigned_to_id: Optional[int] = None
    assigned_to_name: Optional[str] = None
    created_at: datetime 
    updated_at: datetime

    class Config:
        from_attributes = True 


class GrievanceListResponse(BaseModel):
    grievances: List[GrievanceResponse]


class GrievanceAdminResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    student_name: Optional[str] = None
    registration_no: Optional[str] = None
    status: str
    assigned_to_id: Optional[int] = None
    assigned_to_name: Optional[str] = None
    subject: str
    description: str
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GrievanceAdminStudentGroup(BaseModel):
    student_id: Optional[int] = None
    student_name: Optional[str] = None
    registration_no: Optional[str] = None
    grievances: List[GrievanceAdminResponse]


class GrievancePublicResponse(BaseModel):
    id: int
    student_id: Optional[int] = None
    student_name: Optional[str] = None
    registration_no: Optional[str] = None
    status: str
    assigned_to_id: Optional[int] = None
    assigned_to_name: Optional[str] = None
    subject: str
    description: str
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GrievanceFacultyResponse(BaseModel):
    id: int
    student_id: Optional[int]
    student_name: Optional[str]
    registration_no: Optional[str]
    status: Optional[str]
    assigned_to_id: Optional[int]
    assigned_to_name: Optional[str]
    subject: Optional[str]
    description: Optional[str]
    attachment_url: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
