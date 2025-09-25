from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.services.programe import ProgrameService
from src.models.user import User
from src.schemas.master import ProgrameResponse, ProgrameCreate, ProgrameUpdate
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

@router.put("/update/{id}", response_model=ProgrameResponse)
def update_program(id: int, programe_data: ProgrameUpdate, db: Session = Depends(get_db)):
    try:
        service = ProgrameService(db)
        return service.update_programe(id, programe_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        ) 
    
@router.get("/{programe_id}", response_model=ProgrameResponse)
def get_program_by_id(programe_id: int, db: Session = Depends(get_db)):
    try:
        service = ProgrameService(db)
        program = service.get_program_by_id_with_fees(programe_id)
        return program
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )