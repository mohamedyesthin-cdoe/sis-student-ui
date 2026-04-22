import sqlalchemy as sa
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import List, Optional
import re
from types import SimpleNamespace
from fastapi import HTTPException, status
from src.repositories.base import BaseRepository
from src.models.master import (
    Programe, FeeDetails, CourseCode, 
    CourseCategory, CourseTitle, Subjects, Department, ProgramPaymentWorkflowScope,
    AcademicYear, Batch, SemesterMaster
)
from src.models.academic import Semester
from src.schemas.master import (
    ProgrameCreate, ProgrameUpdate, ProgrameResponse, CourseCodeResponse,
    CourseCategoryResponse
)

class MasterRepository:
    def __init__(self, db: Session):
        self.db = db
        self.model = Programe

    def _semesters_use_program_id(self) -> bool:
        bind = self.db.get_bind() or self.db.bind
        if bind is None:
            return False

        inspector = sa.inspect(bind)
        if not inspector.has_table("semesters"):
            return False

        semester_columns = {col["name"] for col in inspector.get_columns("semesters")}
        return "program_id" in semester_columns

    def _programs_use_department_id(self) -> bool:
        bind = self.db.get_bind() or self.db.bind
        if bind is None:
            return False

        inspector = sa.inspect(bind)
        if not inspector.has_table("programs"):
            return False

        program_columns = {col["name"] for col in inspector.get_columns("programs")}
        return "department_id" in program_columns

    def _fetch_semester_rows(self, program_id: Optional[int] = None) -> list[dict]:
        if self._semesters_use_program_id():
            query = (
                self.db.query(
                    Semester.id.label("id"),
                    Semester.program_id.label("program_id"),
                    Semester.program_code.label("program_code"),
                    Semester.semester_no.label("semester_no"),
                    Semester.semester_name.label("semester_name"),
                )
            )
            if program_id is not None:
                query = query.filter(Semester.program_id == program_id)

            rows = query.order_by(Semester.semester_no.asc(), Semester.id.asc()).all()
            return [dict(row._mapping) for row in rows]

        if not self.db.bind:
            return []

        stmt = sa.text(
            """
            SELECT
                s.id AS id,
                sc.programe_id AS program_id,
                p.programe_code AS program_code,
                s.semester_no AS semester_no,
                s.semester_name AS semester_name
            FROM semesters s
            JOIN schemes sc ON sc.id = s.scheme_id
            JOIN programs p ON p.id = sc.programe_id
            """
        )
        params: dict[str, object] = {}
        if program_id is not None:
            stmt = sa.text(
                """
                SELECT
                    s.id AS id,
                    sc.programe_id AS program_id,
                    p.programe_code AS program_code,
                    s.semester_no AS semester_no,
                    s.semester_name AS semester_name
                FROM semesters s
                JOIN schemes sc ON sc.id = s.scheme_id
                JOIN programs p ON p.id = sc.programe_id
                WHERE sc.programe_id = :program_id
                """
            )
            params["program_id"] = program_id

        stmt = stmt.columns(
            id=sa.Integer(),
            program_id=sa.Integer(),
            program_code=sa.String(),
            semester_no=sa.Integer(),
            semester_name=sa.String(),
        ).bindparams(**{k: sa.bindparam(k) for k in params})

        rows = self.db.execute(stmt, params).mappings().all()
        return [dict(row) for row in rows]

    def _fetch_legacy_program_rows(self, program_id: Optional[int] = None) -> list[SimpleNamespace]:
        bind = self.db.get_bind() or self.db.bind
        if bind is None:
            return []

        inspector = sa.inspect(bind)
        program_columns = {col["name"] for col in inspector.get_columns("programs")} if inspector.has_table("programs") else set()

        select_parts = ["p.id AS id"]
        for column_name in [
            "department_id",
            "department_code",
            "programe",
            "short_name",
            "programe_code",
            "duration",
            "category",
            "application_code",
            "batch",
            "academic_year",
            "admission_year",
            "pending_payment_workflow_enabled",
            "created_at",
            "updated_at",
            "faculty",
        ]:
            if column_name in program_columns:
                select_parts.append(f"p.{column_name} AS {column_name}")

        stmt_sql = f"""
            SELECT
                {", ".join(select_parts)},
                f.id AS fee_id,
                f.programe_id AS fee_programe_id,
                f.semester AS fee_semester,
                f.application_fee AS fee_application_fee,
                f.admission_fee AS fee_admission_fee,
                f.tuition_fee AS fee_tuition_fee,
                f.exam_fee AS fee_exam_fee,
                f.lms_fee AS fee_lms_fee,
                f.lab_fee AS fee_lab_fee,
                f.total_fee AS fee_total_fee
            FROM programs p
            LEFT JOIN fee_details f ON f.programe_id = p.id
        """
        params: dict[str, object] = {}
        if program_id is not None:
            stmt_sql += " WHERE p.id = :program_id"
            params["program_id"] = program_id

        stmt = sa.text(stmt_sql)

        rows = self.db.execute(stmt, params).mappings().all()
        grouped: dict[int, dict] = {}

        for row in rows:
            program_id_value = row["id"]
            program = grouped.setdefault(
                program_id_value,
                {
                    "id": row["id"],
                    "department_id": row.get("department_id"),
                    "department_code": row.get("department_code"),
                    "programe": row.get("programe"),
                    "short_name": row.get("short_name"),
                    "programe_code": row.get("programe_code"),
                    "duration": row.get("duration"),
                    "category": row.get("category"),
                    "application_code": row.get("application_code"),
                    "batch": row.get("batch"),
                    "academic_year": row.get("academic_year") or row.get("admission_year"),
                    "pending_payment_workflow_enabled": row.get("pending_payment_workflow_enabled"),
                    "created_at": row.get("created_at"),
                    "updated_at": row.get("updated_at"),
                    "fee": [],
                },
            )

            if row["fee_id"] is not None:
                program["fee"].append(
                    SimpleNamespace(
                        id=row["fee_id"],
                        programe_id=row["fee_programe_id"],
                        semester=row["fee_semester"],
                        application_fee=row["fee_application_fee"],
                        admission_fee=row["fee_admission_fee"],
                        tuition_fee=row["fee_tuition_fee"],
                        exam_fee=row["fee_exam_fee"],
                        lms_fee=row["fee_lms_fee"],
                        lab_fee=row["fee_lab_fee"],
                        total_fee=row["fee_total_fee"],
                    )
                )

        return [SimpleNamespace(**program) for program in grouped.values()]

    def _semester_count_from_duration(self, duration: Optional[str]) -> int:
        if not duration:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duration is required to generate semesters.",
            )

        match = re.search(r"(\d+)", str(duration))
        if not match:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duration must contain a valid year count.",
            )

        years = int(match.group(1))
        if years <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duration must be greater than zero.",
            )

        return years * 2

    def _resolve_department(self, department_id: Optional[int], department_code: Optional[str]) -> Department:
        department = None

        if department_id is not None:
            department = self.get_department_by_id(department_id)
            if not department:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Department id '{department_id}' not found.",
                )

        if department is None and department_code is not None:
            normalized_code = department_code.strip()
            if not normalized_code:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department code cannot be empty.",
                )
            department = self.get_department_by_code(normalized_code)
            if not department:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Department code '{normalized_code}' not found.",
                )

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either department_id or department_code is required.",
            )

        return department

    def _sync_program_semester_codes(self, program: Programe) -> None:
        if not self._semesters_use_program_id():
            return

        if not program.semesters:
            return

        for semester in program.semesters:
            semester.program_code = program.programe_code

    def create_program(self, programe: ProgrameCreate) -> ProgrameResponse:
        try:
            # exclude fees when creating the main program
            program_data = programe.dict(exclude={"fee"})
            semester_count = self._semester_count_from_duration(program_data.get("duration"))
            department = self._resolve_department(
                program_data.get("department_id"),
                program_data.get("department_code"),
            )
            program_data["department_id"] = department.id
            program_data["department_code"] = department.department_code

            if not self._semesters_use_program_id():
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=(
                        "Legacy semester schema detected in UAT. "
                        "Run the semester refactor migration so semesters include program_id "
                        "before creating programs."
                    ),
                )

            obj = self.model(**program_data)
            self.db.add(obj)
            self.db.flush()  # ensures obj.id is available

            semesters = [
                Semester(
                    program_id=obj.id,
                    program_code=obj.programe_code,
                    semester_no=index,
                    semester_name=f"Semester {index}",
                )
                for index in range(1, semester_count + 1)
            ]
            self.db.add_all(semesters)

            # insert fee records
            for fee in programe.fee or []:
                fee_data = fee.dict()
                fee_data["programe_id"] = obj.id
                self.db.add(FeeDetails(**fee_data))

            self.db.commit()
            self.db.refresh(obj)
            return obj

        except HTTPException:
            self.db.rollback()
            raise

        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while creating program: {str(e)}",
            )

    def get_all_programs(self):
        try:
            if not self._programs_use_department_id():
                return self._fetch_legacy_program_rows()

            return (
                self.db.query(self.model)
                .options(
                    joinedload(self.model.fee),  # eager load fees
                    joinedload(self.model.department),
                )
                .all()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching programs: {str(e)}",
            )

    def get_by_id(self, programe_id: int) -> Optional[Programe]:
        try:
            if not self._programs_use_department_id():
                rows = self._fetch_legacy_program_rows(programe_id)
                return rows[0] if rows else None

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
            if not self._programs_use_department_id():
                rows = self._fetch_legacy_program_rows(programe_id)
                return rows[0] if rows else None

            return (
                self.db.query(self.model)
                .options(
                    joinedload(self.model.fee),
                    joinedload(self.model.department),
                )
                .filter(self.model.id == programe_id)
                .first()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching program with fees by id: {str(e)}",
            )

    def get_semesters_by_program_id(self, programe_id: int) -> List[dict]:
        try:
            return self._fetch_semester_rows(programe_id)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching semesters by program id: {str(e)}",
            )

    def get_all_semesters(self) -> List[dict]:
        try:
            return self._fetch_semester_rows()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching all semesters: {str(e)}",
            )

    def get_programs_with_semesters(self) -> List[Programe]:
        try:
            if not self._programs_use_department_id():
                return self._fetch_legacy_program_rows()

            return self.db.query(Programe).order_by(Programe.id.asc()).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching programs with semesters: {str(e)}",
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
            update_data = program_update.dict(exclude_unset=True, exclude={"fee"})
            department_id = update_data.get("department_id")
            department_code = update_data.get("department_code")
            if department_id is not None or department_code is not None:
                department = self._resolve_department(department_id, department_code)
                update_data["department_id"] = department.id
                update_data["department_code"] = department.department_code

            for key, value in update_data.items():
                setattr(program, key, value)

            # Update fees if provided
            if program_update.fee is not None:
                existing_fees = {fee.id: fee for fee in program.fee}
                updated_fee_ids = set()

                for fee_data in program_update.fee:
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

            self._sync_program_semester_codes(program)
            
            self.db.commit()
            self.db.refresh(program)
            return program
        
        except HTTPException:
            self.db.rollback()
            raise

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

    def get_department_by_code(self, department_code: str):
        try:
            return (
                self.db.query(Department)
                .filter(Department.department_code == department_code)
                .first()
            )
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while fetching department by code: {str(e)}",
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
