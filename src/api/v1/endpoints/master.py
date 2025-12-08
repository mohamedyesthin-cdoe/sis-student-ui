from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.services.master import MasterService
from src.models.user import User
from src.schemas.master import *
from src.db.session import get_db
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/programe/add", response_model=ProgrameResponse)
def create_program(programe: ProgrameCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.create_program(programe)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/programe/list", response_model=List[ProgrameResponse])
def list_programs(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_programs()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )

@router.put("/programe/update/{id}", response_model=ProgrameResponse)
def update_program(id: int, programe_data: ProgrameUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.update_programe(id, programe_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        ) 
    
@router.get("/programe/{programe_id}", response_model=ProgrameResponse)
def get_program_by_id(programe_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        program = service.get_program_by_id_with_fees(programe_id)
        return program
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.post("/coursecode/add", response_model=CourseCodeResponse)
def create_course_code(course_code: CourseCodeBase, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.create_course_code(course_code)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/coursecode/list", response_model=List[CourseCodeList])
def list_course_codes(db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.list_course_codes()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.post("/coursecategory/add", response_model=CourseCategoryResponse)
def create_course_category(course_code: CourseCategoryBase, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.create_course_category(course_code)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/coursecategory/list", response_model=List[CourseCategoryList])
def list_course_category(db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.list_course_category()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.post("/coursetitle/add", response_model=CourseTitleResponse)
def create_course_title(course_code: CourseTitleBase, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.create_course_title(course_code)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/coursetitle/list", response_model=List[CourseTitleList])
def list_course_title(db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.list_course_Title()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.post("/syllabus/add", response_model=SyllabusResponse)
def create_syllabus(syllabus: SyllabusCreate, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.create_syllabus(syllabus)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.post("/syllabus/list", response_model=List[SyllabusResponse])
def list_syllabuses(db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.list_syllabuses()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )