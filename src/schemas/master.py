from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FeeSchema(BaseModel):
    semester: str
    application_fee: Optional[str] = None
    admission_fee: Optional[str] = None
    tuition_fee: Optional[str] = None
    exam_fee: Optional[str] = None
    lms_fee: Optional[str] = None
    lab_fee: Optional[str] = None
    total_fee: Optional[str] = None

    class Config:
        from_attributes = True

class FeeUpdate(FeeSchema):
    id: Optional[int] = None

# ----------------------------
# Programe Schemas
# ----------------------------
class ProgrameBase(BaseModel):
    programe: str
    short_name: Optional[str] = None
    programe_code: str
    duration: Optional[str] = None
    category: Optional[str] = None
    faculty: Optional[str] = None

    class Config:
        from_attributes = True

class ProgrameCreate(ProgrameBase):
    fees: Optional[List[FeeSchema]] = None

class ProgrameUpdate(BaseModel):
    programe: Optional[str] = None
    programe_code: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    faculty: Optional[str] = None
    fees: Optional[List[FeeUpdate]] = None


class ProgrameResponse(ProgrameBase):
    id: int
    fees: Optional[List[FeeSchema]] = Field(default_factory=list, alias="fee")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class DataOut(BaseModel):
    list: List[ProgrameResponse]

class ProgrameOut(BaseModel):
    code: int
    status: bool
    message: str
    data: DataOut
