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
    status: str = Field(..., max_length=30, description="open | in_progress | resolved | closed")
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
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GrievanceListResponse(BaseModel):
    grievances: List[GrievanceResponse]


class GrievanceAdminResponse(BaseModel):
    id: int
    subject: str
    description: str
    status: str
    category: str
    attachment_url: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    student_id: Optional[int] = None
    student_name: Optional[str] = None
    registration_no: Optional[str] = None
    program_name: Optional[str] = None

    class Config:
        from_attributes = True
