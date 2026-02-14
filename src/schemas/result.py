from pydantic import BaseModel, Field

class MarksEntryCreate(BaseModel):
    student_id: int
    exam_id: int
    course_id: int
    component_id: int
    marks_obtained: float = Field(..., ge=0)
    entered_by: int

class MarksEntryResponse(BaseModel):
    success: bool
    message: str

class CourseResultResponse(BaseModel):
    student_id: int
    exam_id: int
    course_id: int
    total_marks: float
    percentage: float
    grade: str
    grade_point: int
    result_status: str

class SemesterResultResponse(BaseModel):
    student_id: int
    exam_id: int
    semester_id: int
    total_credits: int
    earned_credits: int
    sgpa: float
    result_status: str
