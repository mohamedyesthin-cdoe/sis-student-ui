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
    batch: Optional[str] = None
    admission_year: Optional[str] = None

    class Config:
        from_attributes = True

class ProgrameOut(BaseModel):
    cat: str
    splty: Optional[str] = None
    div: Optional[str] = None
    code: Optional[str] = None
    des: Optional[str] = None
    cshort: Optional[str] = None
    duration: Optional[str] = None
    faculty: Optional[str] = None

class ProgramListResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: List[ProgrameOut]

class ProgrameCreate(ProgrameBase):
    fee: Optional[List[FeeSchema]] = None

class ProgrameUpdate(BaseModel):
    programe: Optional[str] = None
    programe_code: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    faculty: Optional[str] = None
    batch: Optional[str] = None
    admission_year: Optional[str] = None
    fee: Optional[List[FeeUpdate]] = None


class ProgrameResponse(ProgrameBase):
    id: int
    fee: Optional[List[FeeSchema]]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
        populate_by_name = True

class Programeout(ProgrameBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
        populate_by_name = True

class OfferingResponse(BaseModel):
    id: int
    programe: str
    short_name: Optional[str] = None
    programe_code: str
    created_at: datetime
    updated_at: Optional[datetime]

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

class CourseCodeBase(BaseModel):
    code: str

    class Config:
        from_attributes = True

class CourseCodeOut(BaseModel):
    id: int
    code: str

    class Config:
        from_attributes = True

class CourseCodeList(BaseModel):
    message: str
    code: int
    status: bool
    data: List[CourseCodeOut]

class CourseCodeResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: CourseCodeOut

class CourseCategoryBase(BaseModel):
    name: str

    class Config:
        from_attributes = True

class CourseCategoryOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True 

class CourseCategoryList(BaseModel):
    message: str
    code: int
    status: bool
    data: List[CourseCategoryOut]

class CourseCategoryResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: CourseCategoryOut

class CourseTitleBase(BaseModel):
    title: str

    class Config:
        from_attributes = True

class CourseTitleOut(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class CourseTitleList(BaseModel):
    message: str
    code: int
    status: bool
    data: List[CourseTitleOut]

class CourseTitleResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: CourseTitleOut

class SyllabusBase(BaseModel):
    programe_id: Optional[int]
    semester: str = Field(..., max_length=50)
    credits: int
    tutorial_hours: Optional[int] = 0
    lecture_hours: Optional[int] = 0
    practical_hours: Optional[int] = 0
    total_hours: Optional[int] = 0

    cia: Optional[int] = 0
    esa: Optional[int] = 0
    total_marks: Optional[int] = 0

class SyllabusCreate(SyllabusBase):
    course_code_id: int = Field(..., description="FK → course_code.id")
    course_category_id: int = Field(..., description="FK → course_category.id")
    course_title_id: int = Field(..., description="FK → course_title.id")

class SyllabusUpdate(BaseModel):
    course_code_id: Optional[int] = None
    course_category_id: Optional[int] = None
    course_title_id: Optional[int] = None  
    semester: Optional[str] = None
    credits: Optional[int] = None
    tutorial_hours: Optional[int] = None
    lecture_hours: Optional[int] = None
    practical_hours: Optional[int] = None
    total_hours: Optional[int] = None
    cia: Optional[int] = None
    esa: Optional[int] = None
    total_marks: Optional[int] = None 

class SyllabusOut(SyllabusBase):
    id: int

    course_code: Optional[CourseCodeOut] = None
    course_category: Optional[CourseCategoryOut] = None
    course_title: Optional[CourseTitleOut] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SyllabusResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: Optional[List[SyllabusOut]] = None

class DepartmentBase(BaseModel):
    name: str

    class Config:
        from_attributes = True

class DepartmentOut(DepartmentBase):
    id: int

    class Config:
        from_attributes = True

class DepartmentList(BaseModel):
    message: str
    code: int
    status: bool
    data: List[DepartmentOut]

class DepartmentResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: DepartmentOut

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None

class DepartmentUpdateResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: DepartmentBase