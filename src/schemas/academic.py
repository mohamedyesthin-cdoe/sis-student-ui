from pydantic import BaseModel
from typing import List, Optional

class SemesterBase(BaseModel):
    program_id: int
    program_code: Optional[str] = None
    semester_no: int
    semester_name: str

class SemesterCreate(SemesterBase):
    pass

class SemesterUpdate(BaseModel):
    semester_no: int | None = None
    semester_name: str | None = None

class SemesterResponse(SemesterBase):
    id: int

    class Config:
        from_attributes = True

class ProgramSemesterItem(BaseModel):
    semester_no: int
    semester_name: str

    class Config:
        from_attributes = True

class ProgramSemesterResponse(BaseModel):
    program_id: int
    program_code: Optional[str] = None
    department_code: Optional[str] = None
    semesters: List[ProgramSemesterItem]

    class Config:
        from_attributes = True

class SemesterProgramItem(BaseModel):
    id: int
    semester_no: int
    semester_name: str

    class Config:
        from_attributes = True

class SemesterProgramGroupResponse(BaseModel):
    program_id: int
    program_code: Optional[str] = None
    semesters: List[SemesterProgramItem]

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    semester_id: int
    dept_code: str
    main_code: str
    main_course: str
    course_order: int
    course_type: str
    course_code: str
    course_title: str
    credits: int
    regulation_pattern: str

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True

# class CourseComponentBase(BaseModel):
#     course_id: int
#     component_no: int
#     component_type: str
#     component_code: str
#     component_description: str
#     max_marks: int
#     min_marks: int
#     min_percentage: int
#     exam_mark: Optional[int] = 0
#     is_theory: bool = True
#     is_practical: bool = False
#     is_ia: bool = False
#     is_computed: bool = False
#     computed_components: Optional[List[int]] = None
#     is_others: bool = False
#     specify_others: Optional[str] = None
#     core_or_elective: str
#     is_programme_elective: bool = False
#     elective_type: Optional[str] = None
#     elective_programe_type: Optional[str] = None
#     attendence_percentage: Optional[int] = None
#     book_type: Optional[str] = None
#     mcq_time: Optional[str] = None
#     is_tpi: Optional[str] = None
#     incl_credit: bool = True
#     techorder: Optional[int] = None
#     approved: bool = False
#     is_maincode: bool = False

# class CourseComponentCreate(CourseComponentBase):
#     pass

# class CourseComponentUpdate(BaseModel):
#     component_description: Optional[str] = None
#     max_marks: Optional[int] = None
#     min_marks: Optional[int] = None
#     min_percentage: Optional[int] = None
#     approved: Optional[bool] = None

# class CourseComponentResponse(CourseComponentBase):
#     id: int

#     class Config:
        from_attributes = True

# course_category
class CourseCategoryBase(BaseModel):
    category_code: str
    category_name: str

class CourseCategoryCreate(CourseCategoryBase):
    pass

class CourseCategoryUpdate(BaseModel):
    category_name: Optional[str] = None
    category_code: Optional[str] = None

class CourseCategoryResponse(CourseCategoryBase):
    id: int

    class Config:
        from_attributes = True
