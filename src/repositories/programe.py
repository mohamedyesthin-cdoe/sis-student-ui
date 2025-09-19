from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional
from fastapi import HTTPException, status
from src.repositories.base import BaseRepository
from src.models.master import Programe, FeeDetails
from src.schemas.master import ProgrameCreate, ProgrameUpdate, ProgrameResponse

class ProgrameRepository:
    def __init__(self, db: Session):
        self.db = db
        self.model = Programe

    def create_program(self, programe: ProgrameCreate) -> ProgrameResponse:
        try:
            # exclude fees when creating the main program
            program_data = programe.dict(exclude={"fees"})
            obj = self.model(**program_data)
            self.db.add(obj)
            self.db.flush()  # ensures obj.id is available

            # insert fee records
            for fee in programe.fees:
                fee_data = fee.dict()
                fee_data["programe_id"] = obj.id
                self.db.add(FeeDetails(**fee_data))

            self.db.commit()
            self.db.refresh(obj)
            return obj

        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while creating program: {str(e)}",
            )

    def get_all_programs(self):
        try:
            return (
                self.db.query(self.model)
                .options(joinedload(self.model.fee))  # eager load fees
                .all()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching programs: {str(e)}",
            )
