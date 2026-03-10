from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.api_service import ApiService
from src.core.security.jwt import verify_api_key
from src.schemas.payment import StandardResponse, StudentFeeFlatResponse, AccountMasterResponse
from src.schemas.master import ProgrameOut, ProgramListResponse
from src.schemas.payment import FeesMasterResponse
from src.schemas.api import OdlStudentResponse, LeadResponse, LeadCreate
from src.db.session import get_db
from src.utils.logger import setup_logger
from sqlalchemy.exc import SQLAlchemyError
from src.utils.exceptions import ApiException   

logger = setup_logger()

router = APIRouter()

#student master
@router.get("/students", response_model=StandardResponse, dependencies=[Depends(verify_api_key)], tags=["Finance"])
def student_master(
    db: Session = Depends(get_db),
    next_page: Optional[str] = None,
    previous_page: Optional[str] = None
):
    service = ApiService(db)

    return service.all_student_account_list(
        limit=100,
        next_page=next_page,
        previous_page=previous_page
    )

#fees master
@router.get(
    "/fees",
    response_model=FeesMasterResponse,
    dependencies=[Depends(verify_api_key)],
    tags=["Finance"]
)
def fees_master(db: Session = Depends(get_db)):
    """Retrieve Fees master data."""

    service = ApiService(db)
    program_fees = service.fees_master()
    if not program_fees:
        raise ApiException(404, "Program not found")
    return program_fees

#course master
@router.get(
    "/courses",
    response_model=ProgramListResponse,
    dependencies=[Depends(verify_api_key)],
    tags=["Finance"]
)
def course_master(db: Session = Depends(get_db)):
    """Retrieve course master data."""

    service = ApiService(db)
    programs = service.course_master()
    if not programs:
        raise ApiException(404, "Program not found")
    return programs

#student wise fees master
# @router.get("/student-wise-fees",response_model=StudentFeeFlatResponse,tags=["Finance"])
# def get_all_students_fees(db: Session = Depends(get_db)):
#     service = ApiService(db)
#     return service.get_all_students_fees()

@router.get(
    "/students/fees",
    response_model=StudentFeeFlatResponse,
    dependencies=[Depends(verify_api_key)],
    tags=["Finance"]
)
def get_all_students_fees(
    db: Session = Depends(get_db),
    next_page: Optional[str] = None,
    previous_page: Optional[str] = None
):
    service = ApiService(db)

    return service.get_all_students_fees(
        limit=1,
        next_page=next_page,
        previous_page=previous_page
    )

#account master
@router.get(
    "/accounts",
    response_model=AccountMasterResponse,
    dependencies=[Depends(verify_api_key)],
    tags=["Finance"]
)
def account_master(db: Session = Depends(get_db)):
    service = ApiService(db)
    return service.get_account_master()

# @router.get("/program/fees/list", response_model=ProgrameOut)
# def get_program_fees(db: Session = Depends(get_db)):
#     """Retrieve program fees by program ID."""
#     try:
#         service = ApiService(db)
#         program_fees = service.get_program_fees()
#         if not program_fees:
#             raise HTTPException(status_code=404, detail="Program not found")
#         return program_fees
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")
    
#digi campus student post data
@router.get("/digicampus/students", response_model=List[dict], tags=["digicampus"])
async def get_student_data(db: Session = Depends(get_db)):
    """Retrieve program fees by program ID."""
    try:
        service = ApiService(db)
        program_fees = await service.post_student_data()
        return program_fees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")

#digi campus student put data
@router.put("/digicampus/students/update", response_model=List[dict], tags=["digicampus"])
async def update_student_data(db: Session = Depends(get_db)):
    """Retrieve program fees by program ID."""
    try:
        service = ApiService(db)
        program_fees = await service.put_student_data()
        return program_fees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch program fees: {str(e)}")

@router.post("/lead/add/", response_model=LeadResponse, tags=["widget"])
async def add_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    try:
        service = ApiService(db)
        lead_response = await service.add_lead(lead)
        return lead_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add lead: {str(e)}")