from sqlalchemy.orm import Session
from src.repositories.programe import ProgrameRepository
from src.models.master import Programe
from src.schemas.master import ProgrameCreate, ProgrameUpdate, ProgrameResponse
from fastapi import HTTPException, status
from typing import List

class ProgrameService:
    def __init__(self, db: Session):
        self.repo = ProgrameRepository(db)

    def create_program(self, data: ProgrameCreate) -> ProgrameResponse:
        try:
            return self.repo.create_program(data)
        except HTTPException:
            # bubble up repo errors
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}",
            )
        
    def list_programs(self) -> List[ProgrameResponse]:
        try:
            return self.repo.get_all_programs()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing programs: {str(e)}",
            )