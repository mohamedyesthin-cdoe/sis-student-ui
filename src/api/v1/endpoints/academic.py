from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.services.academic import *
from src.db.session import get_db  
from src.schemas.academic import *
from src.models.user import User
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/courses", response_model=CourseResponse , tags=["Courses"])
def create_course(course_data: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseService(db)
    return service.create_course(course_data)

@router.get("/courses/{course_id}", tags=["Courses"])
def get_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseService(db)
    return service.get_course(course_id)

@router.put("/courses/{course_id}", response_model=CourseResponse, tags=["Courses"])
def update_course(course_id: int, update_data: dict, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseService(db)
    return service.update_course(course_id, update_data)

@router.delete("/courses/{course_id}", tags=["Courses"])
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseService(db)
    return service.delete_course(course_id)

@router.get("/courses", tags=["Courses"])
def list_courses(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseService(db)
    return service.list_courses()

@router.post("/course-components", response_model=CourseComponentResponse, tags=["Course Components"])
def create_course_component(component_data: CourseComponentCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseComponentService(db)
    return service.create_component(component_data)

@router.get("/course-components/{component_id}", tags=["Course Components"])
def get_course_component(component_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseComponentService(db)
    return service.get_component(component_id)

@router.put("/course-components/{component_id}", response_model=CourseComponentResponse, tags=["Course Components"])
def update_course_component(component_id: int, update_data: dict, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseComponentService(db)
    return service.update_component(component_id, update_data)   

@router.delete("/course-components/{component_id}", tags=["Course Components"])
def delete_course_component(component_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseComponentService(db)
    return service.delete_component(component_id)

@router.get("/course-components" , tags=["Course Components"])
def list_course_components(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = CourseComponentService(db)
    return service.list_components()
