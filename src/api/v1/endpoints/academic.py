from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.services.academic import *
from src.db.session import get_db  
from src.schemas.academic import *
from src.models.user import User
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/schemes", response_model=SchemeResponse, tags=["Schemes"])
def create_scheme(scheme_data: SchemeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SchemeService(db)
    return service.create_scheme(scheme_data)

@router.get("/schemes/{scheme_id}", tags=["Schemes"])
def get_scheme(scheme_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SchemeService(db)
    return service.get_scheme(scheme_id)

@router.put("/schemes/{scheme_id}", response_model=SchemeResponse, tags=["Schemes"])
def update_scheme(scheme_id: int, update_data: SchemeUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SchemeService(db)
    update_dict = update_data.model_dump(exclude_unset=True)
    return service.update_scheme(scheme_id, update_dict)

@router.delete("/schemes/{scheme_id}", tags=["Schemes"])
def delete_scheme(scheme_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SchemeService(db)
    return service.delete_scheme(scheme_id)

@router.get("/schemes", tags=["Schemes"])
def list_schemes(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SchemeService(db)
    return service.list_schemes()

@router.post("/semesters", response_model=SemesterResponse, tags=["Semesters"])
def create_semester(semester_data: SemesterCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SemesterService(db)
    return service.create_semester(semester_data)

@router.get("/semesters/{semester_id}", tags=["Semesters"])
def get_semester(semester_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SemesterService(db)
    return service.get_semester(semester_id)

@router.put("/semesters/{semester_id}", response_model=SemesterResponse, tags=["Semesters"])
def update_semester(semester_id: int, update_data: SemesterUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SemesterService(db)
    update_dict = update_data.model_dump(exclude_unset=True)
    return service.update_semester(semester_id, update_dict)

@router.delete("/semesters/{semester_id}" , tags=["Semesters"])
def delete_semester(semester_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SemesterService(db)
    return service.delete_semester(semester_id)

@router.get("/semesters" , tags=["Semesters"])
def list_semesters(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = SemesterService(db)
    return service.list_semesters()

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
