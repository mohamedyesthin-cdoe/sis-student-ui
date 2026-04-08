from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.session import get_db  
from src.services.result import MarksEntryService
from src.schemas.result import *

router = APIRouter()
# ---------------------------------------------------------
# ENTER CIA / ESE MARKS
# ---------------------------------------------------------

@router.post("/markentery",response_model=MarksEntryResponse, tags=["Mark"])
def enter_marks(
    payload: MarksEntryCreate,
    db: Session = Depends(get_db)
):
    service = MarksEntryService(db)
    return service.enter_marks(payload.dict())
