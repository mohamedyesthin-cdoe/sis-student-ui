from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.api_service import ApiService
from src.core.security.jwt import verify_api_key
from src.schemas.payment import StandardResponse
from src.db.session import get_db

router = APIRouter()

@router.get("/payments/list", response_model=StandardResponse, dependencies=[Depends(verify_api_key)])
def get_payments(
    db: Session = Depends(get_db),
    next_page: Optional[str] = None,
    previous_page: Optional[str] = None
    ):
    
    """Retrieve students with payments (paginated)."""
    try:
        service = ApiService(db)
        limit = 5
        result = service.get_payment_all_students(
            limit=limit,
            next_page=next_page,
            previous_page=previous_page
        )
        print(f"Payments fetched successfully: {result}")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch payments: {str(e)}")