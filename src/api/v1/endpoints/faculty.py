from fastapi import APIRouter, Depends, Query, status
from typing import List
from pytest import Session
from src.db.session import get_db
from src.services.faculty import FacultyService
from src.schemas.faculty import (
    FacultyResponse, FacultyCreate,
)

router = APIRouter()

@router.post("/add", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED, tags=["Faculty"])
async def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    """Create a new faculty with associated address.

    Args:
        faculty (facultyCreate): faculty creation data.
        db (Session): Database session.

    Returns:
        facultyResponse: Created faculty details.
    """
    service = FacultyService(db)
    return service.create_faculty(faculty)

@router.get("/list", response_model=List[FacultyResponse], tags=["Faculty"])
async def get_faculty(db: Session = Depends(get_db)):
    """Retrive all faculty with associated address.

    Args:
        db (Session): Database session.

    Returns:
        facultyResponse: Retrive all faculty details.
    """
    service = FacultyService(db)
    return service.get_faculty()

@router.get("/{faculty_id}", response_model=FacultyResponse, tags=["Faculty"])
async def get_by_faculty_id(faculty_id: int, db: Session = Depends(get_db)):
    """
    Retrive faculty object for a given faculty id based
    """
    service = FacultyService(db)
    return service.get_by_faculty_id(faculty_id)