from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from src.schemas.academic import SemesterResponse

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
    id: Optional[int] = None
    department_id: Optional[int] = None
    department_code: Optional[str] = None
    programe: str
    short_name: Optional[str] = None
    programe_code: str
    duration: Optional[str] = None
    category: Optional[str] = None
    batch: Optional[str] = None
    academic_year: Optional[str] = None
    pending_payment_workflow_enabled: bool = False

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
    total_semesters: Optional[int] = None

class ProgramListResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: List[ProgrameOut]

class ProgrameCreate(ProgrameBase):
    fee: Optional[List[FeeSchema]] = None

class ProgrameUpdate(BaseModel):
    department_id: Optional[int] = None
    department_code: Optional[str] = None
    programe: Optional[str] = None
    programe_code: Optional[str] = None
    duration: Optional[str] = None
    category: Optional[str] = None
    batch: Optional[str] = None
    academic_year: Optional[str] = None
    pending_payment_workflow_enabled: Optional[bool] = None
    fee: Optional[List[FeeUpdate]] = None


class ProgrameResponse(ProgrameBase):
    id: int
    fee: Optional[List[FeeSchema]]
    semesters: Optional[List[SemesterResponse]] = None
    total_semesters: Optional[int] = None
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
    department_id: Optional[int] = None
    department_code: Optional[str] = None
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

class MasterCourseCategoryBase(BaseModel):
    name: str

    class Config:
        from_attributes = True

class MasterCourseCategoryOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True 

class MasterCourseCategoryList(BaseModel):
    message: str
    code: int
    status: bool
    data: List[MasterCourseCategoryOut]

class MasterCourseCategoryResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: MasterCourseCategoryOut

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
    master_course_category_id: int = Field(..., description="FK → master_course_category.id")
    course_title_id: int = Field(..., description="FK → course_title.id")

class SyllabusUpdate(BaseModel):
    course_code_id: Optional[int] = None
    master_course_category_id: Optional[int] = None
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
    master_course_category: Optional[MasterCourseCategoryOut] = None
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
    department_code: str

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
    department_code: Optional[str] = None

class DepartmentUpdateResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: DepartmentBase
    
class DepartmentDeleteResponse(BaseModel):
    message: str
    code: int
    status: bool


class ProgramPaymentWorkflowUpdate(BaseModel):
    batch: str
    admission_year: str
    semester: str
    enabled: bool


class ProgramPaymentWorkflowResponse(BaseModel):
    message: str
    code: int
    status: bool
    program_id: int
    pending_payment_workflow_enabled: bool


class ProgramPaymentWorkflowScopeUpsert(BaseModel):
    batch: str
    admission_year: str
    semester: str
    enabled: bool


class ProgramPaymentWorkflowScopeOut(BaseModel):
    id: int
    program_id: int
    batch: str
    admission_year: str
    semester: str
    enabled: bool

    class Config:
        from_attributes = True


class ProgramPaymentWorkflowScopeListResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: List[ProgramPaymentWorkflowScopeOut]


# ----------------------------
# Academic Year Schemas
# ----------------------------
class AcademicYearBase(BaseModel):
    year_code: str
    start_year: int
    end_year: int
    start_month: int = 7
    end_month: int = 6
    is_active: bool = False
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AcademicYearCreate(AcademicYearBase):
    pass


class AcademicYearUpdate(BaseModel):
    year_code: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    start_month: Optional[int] = None
    end_month: Optional[int] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class AcademicYearResponse(AcademicYearBase):
    id: int


# ----------------------------
# Batch Schemas
# ----------------------------
class BatchBase(BaseModel):
    academic_year_id: int
    batch_number: int
    batch_name: str
    start_month: int
    end_month: int
    is_active: bool = False
    description: Optional[str] = None

    class Config:
        from_attributes = True


class BatchCreate(BatchBase):
    pass


class BatchUpdate(BaseModel):
    batch_number: Optional[int] = None
    batch_name: Optional[str] = None
    start_month: Optional[int] = None
    end_month: Optional[int] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class BatchResponse(BatchBase):
    id: int


# ----------------------------
# Semester Master Schemas
# ----------------------------
class SemesterMasterBase(BaseModel):
    program_type: str  # "UG" or "PG"
    semester_number: int
    semester_name: str
    is_active: bool = True
    description: Optional[str] = None

    class Config:
        from_attributes = True


class SemesterMasterCreate(SemesterMasterBase):
    pass


class SemesterMasterUpdate(BaseModel):
    program_type: Optional[str] = None
    semester_number: Optional[int] = None
    semester_name: Optional[str] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class SemesterMasterResponse(SemesterMasterBase):
    id: int
