from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.academic import Semester, Course, CourseComponent
from src.repositories.academic import *

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
    
    def list_semesters(self) -> list[Semester]:
        return self.semester_repo.list_semesters()
    
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
    
    def list_courses(self) -> list[Course]:
        return self.course_repo.list_courses()
    
class CourseComponentService:
    def __init__(self, db: Session):
        self.component_repo = CourseComponentRepository(db)

    def create_component(self, component_data) -> CourseComponent:
        data = component_data.dict() if hasattr(component_data, "dict") else component_data
        return self.component_repo.create_course_component(data)
    
    def get_component(self, component_id: int) -> CourseComponent:
        component = self.component_repo.get_course_component(component_id)
        if not component:
            raise HTTPException(status_code=404, detail="Course Component not found")
        return component
    
    def update_component(self, component_id: int, update_data: dict) -> CourseComponent:
        component = self.component_repo.update_course_component(component_id, update_data)
        if not component:
            raise HTTPException(status_code=404, detail="Course Component not found")
        return component
    
    def delete_component(self, component_id: int) -> bool:
        success = self.component_repo.delete_course_component(component_id)
        if not success:
            raise HTTPException(status_code=404, detail="Course Component not found")
        return success
    
    def list_components(self) -> list[CourseComponent]:
        return self.component_repo.list_course_components()

    
    
