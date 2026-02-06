from fastapi import APIRouter, Depends, Query, status
from typing import List
from pytest import Session
from src.db.session import get_db
from src.services.staff import StaffService
from src.schemas.staff import (
    StaffResponse, StaffCreate, StaffBase
)
from src.models.user import User
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/add", response_model=StaffResponse, status_code=status.HTTP_201_CREATED, tags=["Staff"])
async def create_staff(staff: StaffBase, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Create a new staff with associated address.

    Args:
        staff (staffCreate): staff creation data.
        db (Session): Database session.

    Returns:
        staffResponse: Created staff details.
    """
    service = StaffService(db)
    return await service.create_staff(staff)

@router.get("/list", response_model=List[StaffResponse], tags=["Staff"])
async def get_staff(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Retrive all staff with associated address.

    Args:
        db (Session): Database session.

    Returns:
        staffResponse: Retrive all staff details.
    """
    service = StaffService(db)
    return service.get_staff()

@router.get("/{staff_id}", response_model=StaffResponse, tags=["Staff"])
async def get_by_staff_id(staff_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """
    Retrive staff object for a given staff id based
    """
    service = StaffService(db)
    return service.get_by_staff_id(staff_id)