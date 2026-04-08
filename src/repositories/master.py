from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import List, Optional
from fastapi import HTTPException, status
from src.repositories.base import BaseRepository
from src.models.master import (
    Programe, FeeDetails, CourseCode, 
    CourseCategory, CourseTitle, Subjects, Department, ProgramPaymentWorkflowScope,
    AcademicYear, Batch, SemesterMaster
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
            program_data = programe.dict(exclude={"fee"})
            obj = self.model(**program_data)
            self.db.add(obj)
            self.db.flush()  # ensures obj.id is available

            # insert fee records
            for fee in programe.fee:
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
        
    def get_program(self):
        try:
            return self.db.query(self.model).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching programs: {str(e)}",
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
            self.db.query(Subjects)
            .filter(
                Subjects.course_code_id == course_code_id,
                Subjects.course_category_id == course_category_id,
                Subjects.course_title_id == course_title_id
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
        
    def get_all_syllabuses(self) -> List[Subjects]:
        try:
            return (
                self.db.query(Subjects)
                .options(
                    joinedload(Subjects.course_code),
                    joinedload(Subjects.course_category),
                    joinedload(Subjects.course_title),
                    joinedload(Subjects.programe),
                )
                .all()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching syllabuses: {str(e)}",
            )
        
        # =========================
    # Department Methods
    # =========================

    def get_department_by_name(self, name: str):
        try:
            return self.db.query(Department).filter(Department.name == name).first()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching department by name: {str(e)}",
            )


    def get_all_departments(self) -> List[Department]:
        try:
            return self.db.query(Department).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching departments: {str(e)}",
            )


    def get_department_by_id(self, department_id: int) -> Optional[Department]:
        try:
            return (
                self.db.query(Department)
                .filter(Department.id == department_id)
                .first()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching department by id: {str(e)}",
            )


    def update_department(self, department_id: int, data: dict) -> Department:
        department = self.get_department_by_id(department_id)

        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )

        try:
            for key, value in data.items():
                setattr(department, key, value)

            self.db.commit()
            self.db.refresh(department)

            return department

        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while updating department: {str(e)}",
            )


    def delete_department(self, department_id: int) -> None:
        department = self.get_department_by_id(department_id)

        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )

        try:
            # Prevent delete if staff exists
            if department.staff:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot delete department. Staff are assigned to this department."
                )

            self.db.delete(department)
            self.db.commit()

        except HTTPException:
            raise

        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while deleting department: {str(e)}",
            )

    def upsert_program_payment_workflow_scope(
        self,
        programe_id: int,
        batch: str,
        admission_year: str,
        semester: str,
        enabled: bool
    ) -> ProgramPaymentWorkflowScope:
        scope = (
            self.db.query(ProgramPaymentWorkflowScope)
            .filter(
                ProgramPaymentWorkflowScope.program_id == programe_id,
                ProgramPaymentWorkflowScope.batch == batch,
                ProgramPaymentWorkflowScope.admission_year == admission_year,
                ProgramPaymentWorkflowScope.semester == semester,
            )
            .first()
        )

        if scope:
            scope.enabled = enabled
            self.db.commit()
            self.db.refresh(scope)
            return scope

        scope = ProgramPaymentWorkflowScope(
            program_id=programe_id,
            batch=batch,
            admission_year=admission_year,
            semester=semester,
            enabled=enabled,
        )
        self.db.add(scope)
        self.db.commit()
        self.db.refresh(scope)
        return scope

    def list_program_payment_workflow_scopes(self, programe_id: int = None) -> List[ProgramPaymentWorkflowScope]:
        query = self.db.query(ProgramPaymentWorkflowScope)
        if programe_id is not None:
            query = query.filter(ProgramPaymentWorkflowScope.program_id == programe_id)
        return (
            query.order_by(
                ProgramPaymentWorkflowScope.batch.asc(),
                ProgramPaymentWorkflowScope.admission_year.asc(),
                ProgramPaymentWorkflowScope.semester.asc(),
            )
            .all()
        )

    def get_program_payment_workflow_scope(
        self,
        programe_id: int,
        batch: str,
        admission_year: str,
        semester: str
    ) -> Optional[ProgramPaymentWorkflowScope]:
        return (
            self.db.query(ProgramPaymentWorkflowScope)
            .filter(
                ProgramPaymentWorkflowScope.program_id == programe_id,
                ProgramPaymentWorkflowScope.batch == batch,
                ProgramPaymentWorkflowScope.admission_year == admission_year,
                ProgramPaymentWorkflowScope.semester == semester,
            )
            .first()
        )

    # ------- Academic Year Methods -------
    def create_academic_year(self, academic_year_data: dict) -> AcademicYear:
        try:
            academic_year = AcademicYear(**academic_year_data)
            self.db.add(academic_year)
            self.db.commit()
            self.db.refresh(academic_year)
            return academic_year
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Academic year already exists"
            )
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    def get_academic_year_by_id(self, academic_year_id: int) -> Optional[AcademicYear]:
        return self.db.query(AcademicYear).filter(AcademicYear.id == academic_year_id).first()

    def get_all_academic_years(self) -> List[AcademicYear]:
        return self.db.query(AcademicYear).order_by(AcademicYear.year_code.desc()).all()

    def update_academic_year(self, academic_year_id: int, update_data: dict) -> Optional[AcademicYear]:
        academic_year = self.get_academic_year_by_id(academic_year_id)
        if not academic_year:
            return None
        for key, value in update_data.items():
            if value is not None:
                setattr(academic_year, key, value)
        self.db.commit()
        self.db.refresh(academic_year)
        return academic_year

    def delete_academic_year(self, academic_year_id: int) -> bool:
        academic_year = self.get_academic_year_by_id(academic_year_id)
        if not academic_year:
            return False
        self.db.delete(academic_year)
        self.db.commit()
        return True

    # ------- Batch Methods -------
    def create_batch(self, batch_data: dict) -> Batch:
        try:
            batch = Batch(**batch_data)
            self.db.add(batch)
            self.db.commit()
            self.db.refresh(batch)
            return batch
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    def get_batch_by_id(self, batch_id: int) -> Optional[Batch]:
        return self.db.query(Batch).filter(Batch.id == batch_id).first()

    def get_batches_by_academic_year(self, academic_year_id: int) -> List[Batch]:
        return self.db.query(Batch).filter(Batch.academic_year_id == academic_year_id).order_by(Batch.batch_number).all()

    def get_all_batches(self) -> List[Batch]:
        return self.db.query(Batch).all()

    def update_batch(self, batch_id: int, update_data: dict) -> Optional[Batch]:
        batch = self.get_batch_by_id(batch_id)
        if not batch:
            return None
        for key, value in update_data.items():
            if value is not None:
                setattr(batch, key, value)
        self.db.commit()
        self.db.refresh(batch)
        return batch

    def delete_batch(self, batch_id: int) -> bool:
        batch = self.get_batch_by_id(batch_id)
        if not batch:
            return False
        self.db.delete(batch)
        self.db.commit()
        return True

    # ------- Semester Master Methods -------
    def create_semester_master(self, semester_data: dict) -> SemesterMaster:
        try:
            semester = SemesterMaster(**semester_data)
            self.db.add(semester)
            self.db.commit()
            self.db.refresh(semester)
            return semester
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Semester already exists for this program type"
            )
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    def get_semester_master_by_id(self, semester_id: int) -> Optional[SemesterMaster]:
        return self.db.query(SemesterMaster).filter(SemesterMaster.id == semester_id).first()

    def get_semesters_by_program_type(self, program_type: str) -> List[SemesterMaster]:
        return self.db.query(SemesterMaster).filter(SemesterMaster.program_type == program_type).order_by(SemesterMaster.semester_number).all()

    def get_all_semester_masters(self) -> List[SemesterMaster]:
        return self.db.query(SemesterMaster).order_by(SemesterMaster.program_type, SemesterMaster.semester_number).all()

    def update_semester_master(self, semester_id: int, update_data: dict) -> Optional[SemesterMaster]:
        semester = self.get_semester_master_by_id(semester_id)
        if not semester:
            return None
        for key, value in update_data.items():
            if value is not None:
                setattr(semester, key, value)
        self.db.commit()
        self.db.refresh(semester)
        return semester

    def delete_semester_master(self, semester_id: int) -> bool:
        semester = self.get_semester_master_by_id(semester_id)
        if not semester:
            return False
        self.db.delete(semester)
        self.db.commit()
        return True
