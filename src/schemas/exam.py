from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time

class ExamBase(BaseModel):
    semester_id: int
    exam_name: str
    exam_type: str
    month_year: str
    is_published: bool

class ExamCreate(ExamBase):
    pass    

class ExamUpdate(BaseModel):
    exam_name: str | None = None
    exam_type: str | None = None
    month_year: str | None = None
    is_published: bool | None = None

class ExamResponse(ExamBase):
    id: int

    class Config:
        from_attributes = True

class ExamTimeTableBase(BaseModel):
    exam_id: int
    course_id: int
    component_id: int
    exam_date: date
    start_time: time
    end_time: time

class ExamTimeTableCreate(ExamTimeTableBase):
    pass

class ExamTimeTableUpdate(BaseModel):
    exam_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None

class ExamTimeTableResponse(ExamTimeTableBase):
    id: int

    class Config:
        from_attributes = True

class ExamRegistrationBase(BaseModel):
    exam_id: int
    semester_id: int

class ExamRegistrationResponse(BaseModel):
    success: bool
    message: str
    total_students_registered: int
    
