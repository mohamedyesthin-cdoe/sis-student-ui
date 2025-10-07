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
        
    def update_programe(self, programe_id: int, data: ProgrameUpdate) -> ProgrameResponse:
        try:
            return self.repo.update_program(programe_id, data)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating program: {str(e)}",
            )
        
    def get_program_by_id_with_fees(self, programe_id: int) -> Programe:
        try:
            program = self.repo.get_by_id(programe_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
            )
            return program
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching program: {str(e)}",
            )
        
    def get_program_by_code(self, code: str) -> Programe:
        try:
            program = self.repo.get_by_code(code)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
            )
            return program
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching program by code: {str(e)}",
            )