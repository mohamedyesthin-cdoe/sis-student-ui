from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.services.programe import ProgrameService
from src.models.user import User
from src.schemas.master import ProgrameResponse, ProgrameCreate
from src.db.session import get_db
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/add", response_model=ProgrameResponse)
def create_program(programe: ProgrameCreate, db: Session = Depends(get_db)):
    try:
        service = ProgrameService(db)
        return service.create_program(programe)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/list", response_model=List[ProgrameResponse])
def list_programs(db: Session = Depends(get_db)):
    try:
        service = ProgrameService(db)
        return service.list_programs()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )