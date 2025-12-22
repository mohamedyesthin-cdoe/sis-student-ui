from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.api_service import ApiService
from src.core.security.jwt import verify_api_key
from src.schemas.payment import StandardResponse
from src.schemas.master import ProgrameOut
from src.schemas.api import OdlStudentResponse
from src.db.session import get_db
from src.utils.logger import setup_logger
from sqlalchemy.exc import SQLAlchemyError

logger = setup_logger()

router = APIRouter()

@router.get("/student/list", response_model=StandardResponse, dependencies=[Depends(verify_api_key)])
def get_payments(
    db: Session = Depends(get_db),
    next_page: Optional[str] = None,
    previous_page: Optional[str] = None
    ):
    
    """Retrieve students with payments (paginated)."""
    try:
        service = ApiService(db)
        limit = 20
        result = service.get_payment_all_students(
            limit=limit,
            next_page=next_page,
            previous_page=previous_page
        )
        logger.info("Payments fetched successfully")
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch payments: {str(e)}")
    
@router.get("/program/fees/list", response_model=ProgrameOut)
def get_program_fees(db: Session = Depends(get_db)):
    """Retrieve program fees by program ID."""
    try:
        service = ApiService(db)
        program_fees = service.get_program_fees()
        if not program_fees:
            raise HTTPException(status_code=404, detail="Program not found")
        return program_fees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")
    
@router.get("/get/student/list", response_model=List[dict])
async def get_student_data(db: Session = Depends(get_db)):
    """Retrieve program fees by program ID."""
    try:
        service = ApiService(db)
        program_fees = await service.post_student_data()
        return program_fees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")

@router.get("/put/student/list", response_model=List[dict])
async def get_student_data(db: Session = Depends(get_db)):
    """Retrieve program fees by program ID."""
    try:
        service = ApiService(db)
        program_fees = await service.put_student_data()
        return program_fees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")
 