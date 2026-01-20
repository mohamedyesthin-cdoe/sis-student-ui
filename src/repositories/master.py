from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import List, Optional
from fastapi import HTTPException, status
from src.repositories.base import BaseRepository
from src.models.master import (
    Programe, FeeDetails, CourseCode, 
    CourseCategory, CourseTitle, SemesterSyllabus
)
from src.schemas.master import (
    ProgrameCreate, ProgrameUpdate, ProgrameResponse, CourseCodeResponse,
    CourseCategoryResponse
)

class MasterRepository:
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

    def get_by_id(self, programe_id: int) -> Optional[Programe]:
        try:
            return self.db.query(self.model).filter(self.model.id == programe_id).first()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching program by id: {str(e)}",
            )
        
    def get_by_id_with_fees(self, programe_id: int) -> Optional[Programe]:
        try:
            return (
                self.db.query(self.model)
                .options(joinedload(self.model.fee))
                .filter(self.model.id == programe_id)
                .first()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching program with fees by id: {str(e)}",
            )
    
    def update_program(self, programe_id: int, program_update: ProgrameUpdate) -> ProgrameResponse:
        program = self.get_by_id_with_fees(programe_id)
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Program with id {programe_id} not found",
            )
        
        try:
            # Update main program fields
            for key, value in program_update.dict(exclude_unset=True, exclude={"fees"}).items():
                setattr(program, key, value)

            # Update fees if provided
            if program_update.fees is not None:
                existing_fees = {fee.id: fee for fee in program.fee}
                updated_fee_ids = set()

                for fee_data in program_update.fees:
                    if fee_data.id and fee_data.id in existing_fees:
                        # Update existing fee
                        fee = existing_fees[fee_data.id]
                        for key, value in fee_data.dict(exclude_unset=True, exclude={"id"}).items():
                            setattr(fee, key, value)
                        updated_fee_ids.add(fee_data.id)
                    else:
                        # New fee entry
                        new_fee = FeeDetails(**fee_data.dict(), programe_id=program.id)
                        self.db.add(new_fee)

                # Delete fees not in the update list
                for fee_id, fee in existing_fees.items():
                    if fee_id not in updated_fee_ids:
                        self.db.delete(fee)
            
            self.db.commit()
            self.db.refresh(program)
            return program
        
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while updating program: {str(e)}",
            )
                
    def get_by_code(self, code: str) -> Optional[Programe]:
        try:
            return self.db.query(self.model).filter(self.model.application_code == code).first()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching program by code: {str(e)}",
            )
        
    def get_course_code(self, course_code: str) -> Optional[CourseCode]:
        return (
            self.db.query(CourseCode)
            .filter(CourseCode.code == course_code)
            .first()
        )
    
    def get_all_course_codes(self) -> List[CourseCode]:
        return self.db.query(CourseCode).all()
    
    def get_course_category(self, category_name: str) -> Optional[CourseCategory]:
        return (
            self.db.query(CourseCategory)
            .filter(CourseCategory.name == category_name)
            .first()
        )
    
    def get_all_course_category(self) -> List[CourseCategory]:
        return self.db.query(CourseCategory).all()
    
    def get_course_title(self, title_name: str) -> Optional[CourseTitle]:
        return (
            self.db.query(CourseTitle)
            .filter(CourseTitle.title == title_name)
            .first()
        )
    
    def get_all_course_title(self) -> List[CourseTitle]:
        return self.db.query(CourseTitle).all()
    
    def get_syllabus(self, course_code_id: int, course_category_id: int,course_title_id: int) -> Optional[CourseTitle]:
        return (
            self.db.query(SemesterSyllabus)
            .filter(
                SemesterSyllabus.course_code_id == course_code_id,
                SemesterSyllabus.course_category_id == course_category_id,
                SemesterSyllabus.course_title_id == course_title_id
            )
            .first()
        )

    def create_fields(self, data, model, response_model):
        try:
            obj = model(**data.dict())
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Course Code already Exists.",
            )
        
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while creating course code: {str(e)}",
            )
        
    def get_all_syllabuses(self) -> List[SemesterSyllabus]:
        try:
            return (
                self.db.query(SemesterSyllabus)
                .options(
                    joinedload(SemesterSyllabus.course_code),
                    joinedload(SemesterSyllabus.course_category),
                    joinedload(SemesterSyllabus.course_title),
                    joinedload(SemesterSyllabus.programe),
                )
                .all()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching syllabuses: {str(e)}",
            )
        
