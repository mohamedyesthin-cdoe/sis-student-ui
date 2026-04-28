from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.academic import Semester, Course
from src.repositories.academic import *
from src.schemas.academic import SemesterProgramGroupResponse, SemesterProgramItem,CourseResponse

class SemesterService:
    def __init__(self, db: Session):
        self.semester_repo = SemesterRepository(db)

    def create_semester(self, semester_data) -> Semester:
        data = semester_data.dict() if hasattr(semester_data, "dict") else semester_data
        return self.semester_repo.create_semester(data)
    
    def get_semester(self, semester_id: int) -> Semester:
        semester = self.semester_repo.get_semester(semester_id)
        if not semester:
            raise HTTPException(status_code=404, detail="Semester not found")
        return semester
    
    def update_semester(self, semester_id: int, update_data: dict) -> Semester:
        semester = self.semester_repo.update_semester(semester_id, update_data)
        if not semester:
            raise HTTPException(status_code=404, detail="Semester not found")
        return semester
    
    def delete_semester(self, semester_id: int) -> bool:
        success = self.semester_repo.delete_semester(semester_id)
        if not success:
            raise HTTPException(status_code=404, detail="Semester not found")
        return success

    def list_semesters(self, program_id: int) -> list[SemesterProgramGroupResponse]:

        semesters = self.semester_repo.list_semesters(program_id)
        grouped: dict[int, SemesterProgramGroupResponse] = {}
        
        for semester in semesters:
            prog_id = semester.program_id
            program_code = getattr(semester, "program_code", None)
            
            if semester.program is not None and program_code is None:
                program_code = getattr(
                    semester.program,
                    "program_code",
                    None
                )

            if prog_id not in grouped:
                grouped[prog_id] = SemesterProgramGroupResponse(
                    program_id=prog_id,
                    program_code=program_code,
                    semesters=[]
                )
            
            grouped[prog_id].semesters.append(
                SemesterProgramItem(
                    id=semester.id,
                    semester_no=semester.semester_no,
                    semester_name=semester.semester_name,
                )
            )
        return [ grouped[pid] for pid in sorted(grouped) ]

class CourseService:
    def __init__(self, db: Session):
        self.course_repo = CourseRepository(db)

    def create_course(self, course_data) -> Course:
        data = course_data.dict() if hasattr(course_data, "dict") else course_data
        return self.course_repo.create_course(data)
    
    def get_course(self, course_id: int) -> Course:
        course = self.course_repo.get_course(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    
    def update_course(self, course_id: int, update_data: dict) -> Course:
        course = self.course_repo.update_course(course_id, update_data)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    
    def delete_course(self, course_id: int) -> bool:
        success = self.course_repo.delete_course(course_id)
        if not success:
            raise HTTPException(status_code=404, detail="Course not found")
        return success
    
    def list_courses(self) -> list[CourseResponse]:
        
        courses = self.course_repo.list_courses()
        response: list[CourseResponse] = []

        for course in courses:
            program_code = getattr(
                course,
                "programe_code",
                None
            )

            if course.program is not None and program_code is None:
                program_code = getattr(
                    course.program,
                    "programe_code",
                    None
                )

            # program_name
            program_name = None

            if course.program is not None:
                program_name = getattr(
                    course.program,
                    "programe",
                    None
                )

            # semester_name
            semester_name = None

            if course.semester is not None:
                semester_name = getattr(
                    course.semester,
                    "semester_name",
                None
            )

            response.append(

                CourseResponse(

                    id=course.id,
                    course_code=course.course_code,
                    course_title=course.course_title,

                    semester_id=course.semester_id,
                    semester_name=semester_name,

                    credits=course.credits,

                    course_category=course.course_category,
                    regulation_pattern=course.regulation_pattern,

                    created_at=course.created_at,
                    updated_at=course.updated_at,

                    program_id=course.program_id,
                    program_code=program_code,
                    program_name=program_name,
                )
            )

        return response
    # def list_courses(self) -> list[Course]:
    #     return self.course_repo.list_courses()
    # def list_courses(self) -> list[ProgramCourseResponse]:
        
    #     courses = self.course_repo.list_courses()
    #     grouped: dict[int, ProgramCourseResponse] = {}

    #     for course in courses:

    #         prog_id = course.program_id

    #         # program_code
    #         program_code = getattr(
    #             course,
    #             "programe_code",
    #             None
    #         )

    #         if course.program is not None and program_code is None:

    #             program_code = getattr(
    #                 course.program,
    #                 "programe_code",
    #                 None
    #             )

    #         # program_name
    #         program_name = None

    #         if course.program is not None:

    #             program_name = getattr(
    #                 course.program,
    #                 "programe",
    #                 None
    #             )
            
    #         # create group if not exists
    #         if prog_id not in grouped:
    #             grouped[prog_id] = ProgramCourseResponse(

    #                 program_id=prog_id,
    #                 program_code=program_code,
    #                 program_name=program_name,
    #                 courses=[]
    #             )

    #         # semester_name
    #         semester_name = None

    #         if course.semester is not None:

    #             semester_name = getattr(
    #                 course.semester,
    #                 "semester_name",
    #                 None
    #             )

    #         grouped[prog_id].courses.append(

    #             CourseItemResponse(

    #                 id=course.id,
    #                 course_code=course.course_code,
    #                 course_title=course.course_title,
    #                 semester_id=course.semester_id,
    #                 semester_name=semester_name,
    #                 credits=course.credits,
    #             )
    #         )

    #     return [grouped[pid] for pid in sorted(grouped)]    
# class CourseComponentService:
#     def __init__(self, db: Session):
#         self.component_repo = CourseComponentRepository(db)

#     def create_component(self, component_data) -> CourseComponent:
#         data = component_data.dict() if hasattr(component_data, "dict") else component_data
#         return self.component_repo.create_course_component(data)
    
#     def get_component(self, component_id: int) -> CourseComponent:
#         component = self.component_repo.get_course_component(component_id)
#         if not component:
#             raise HTTPException(status_code=404, detail="Course Component not found")
#         return component
    
#     def update_component(self, component_id: int, update_data: dict) -> CourseComponent:
#         component = self.component_repo.update_course_component(component_id, update_data)
#         if not component:
#             raise HTTPException(status_code=404, detail="Course Component not found")
#         return component
    
#     def delete_component(self, component_id: int) -> bool:
#         success = self.component_repo.delete_course_component(component_id)
#         if not success:
#             raise HTTPException(status_code=404, detail="Course Component not found")
#         return success
    
#     def list_components(self) -> list[CourseComponent]:
#         return self.component_repo.list_course_components()

# course_category
class CourseCategoryService:
    def __init__(self, db: Session):
        self.component_repo = CourseCategoryRepository(db)

    def create_category(self, category_data) -> CourseCategory:
        data = category_data.dict() if hasattr(category_data, "dict") else category_data
        return self.component_repo.create_course_category(data)

    def get_category(self, category_id: int) -> CourseCategory:
        category = self.component_repo.get_course_category(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Course Category not found")
        return category

    def update_category(self, category_id: int, update_data: dict) -> CourseCategory:
        category = self.component_repo.update_course_category(category_id, update_data)
        if not category:
            raise HTTPException(status_code=404, detail="Course Category not found")
        return category

    def delete_category(self, category_id: int) -> bool:
        success = self.component_repo.delete_course_category(category_id)
        if not success:
            raise HTTPException(status_code=404, detail="Course Category not found")
        return success

    def list_categories(self) -> list[CourseCategory]:
        return self.component_repo.list_course_categories()

    
