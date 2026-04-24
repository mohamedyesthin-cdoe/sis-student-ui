from sqlalchemy.orm import Session
from src.repositories.master import MasterRepository
from src.models.master import *
from src.schemas.master import *
from src.schemas.academic import ProgramSemesterResponse, ProgramSemesterItem
from fastapi import HTTPException, status
from typing import List, Optional
from src.services.student_service import StudentService

class MasterService:
    def __init__(self, db: Session):
        self.repo = MasterRepository(db)

    def _value(self, obj, key: str, default=None):
        if isinstance(obj, dict):
            return obj.get(key, default)
        return getattr(obj, key, default)

    def _resolve_department_fields(self, program: Programe) -> tuple[Optional[int], Optional[str]]:
        department_id = self._value(program, "department_id")
        department_code = self._value(program, "department_code")
        department = self._value(program, "department")

        if department is not None:
            department_id = department_id or self._value(department, "id")
            department_code = department_code or self._value(department, "department_code")

        if department_id is None and department_code:
            matched_department = self.repo.get_department_by_code(department_code)
            if matched_department:
                department_id = matched_department.id
                department_code = matched_department.department_code

        if department_code is None and department_id is not None:
            matched_department = self.repo.get_department_by_id(department_id)
            if matched_department:
                department_code = matched_department.department_code

        return department_id, department_code

    def _serialize_fee(self, fee: FeeDetails) -> dict:
        return {
            "id": self._value(fee, "id"),
            "semester": self._value(fee, "semester"),
            "application_fee": self._value(fee, "application_fee"),
            "admission_fee": self._value(fee, "admission_fee"),
            "tuition_fee": self._value(fee, "tuition_fee"),
            "exam_fee": self._value(fee, "exam_fee"),
            "lms_fee": self._value(fee, "lms_fee"),
            "lab_fee": self._value(fee, "lab_fee"),
            "total_fee": self._value(fee, "total_fee"),
        }

    def _serialize_program(self, program: Programe, semester_rows: list[dict]) -> dict:
        department_id, department_code = self._resolve_department_fields(program)
        semesters = [
            {
                "id": row["id"],
                "program_id": row["program_id"],
                "program_code": row.get("program_code"),
                "semester_no": row["semester_no"],
                "semester_name": row["semester_name"],
            }
            for row in semester_rows
        ]

        fees = self._value(program, "fee", []) or []

        return {
            "id": self._value(program, "id"),
            "department_id": department_id,
            "department_code": department_code,
            "programe": self._value(program, "programe"),
            "short_name": self._value(program, "short_name"),
            "programe_code": self._value(program, "programe_code"),
            "duration": self._value(program, "duration"),
            "category": self._value(program, "category"),
            "batch": self._value(program, "batch"),
            "academic_year": self._value(program, "academic_year"),
            "pending_payment_workflow_enabled": self._value(program, "pending_payment_workflow_enabled"),
            "fee": [self._serialize_fee(fee) for fee in fees],
            "semesters": semesters,
            "total_semesters": len(semesters),
            "created_at": self._value(program, "created_at"),
            "updated_at": self._value(program, "updated_at"),
        }

    def _generated_semester_rows(self, program) -> list[dict]:
        duration = self._value(program, "duration")
        try:
            semester_count = self.repo._semester_count_from_duration(duration)
        except HTTPException:
            return []

        program_id = self._value(program, "id")
        program_code = self._value(program, "programe_code")
        return [
            {
                # Synthetic id keeps response validation happy when UAT has no semester rows yet.
                "id": int(f"{program_id}{semester_no:02d}"),
                "program_id": program_id,
                "program_code": program_code,
                "semester_no": semester_no,
                "semester_name": f"Semester {semester_no}",
            }
            for semester_no in range(1, semester_count + 1)
        ]

    def create_program(self, data: ProgrameCreate) -> ProgrameResponse:
        try:
            program = self.repo.create_program(data)
            program = self.repo.get_by_id_with_fees(program.id) or program
            semester_rows = self.repo.get_semesters_by_program_id(program.id)
            return self._serialize_program(program, semester_rows)
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
            programs = self.repo.get_all_programs()
            semester_rows = self.repo.get_all_semesters()
            semesters_by_program: dict[int, list[dict]] = {}

            for row in semester_rows:
                semesters_by_program.setdefault(row["program_id"], []).append(row)

            return [
                self._serialize_program(
                    program,
                    sorted(
                        semesters_by_program.get(self._value(program, "id"), [])
                        or self._generated_semester_rows(program),
                        key=lambda item: item["semester_no"],
                    ),
                )
                for program in programs
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing programs: {str(e)}",
            )
        
    def update_programe(self, programe_id: int, data: ProgrameUpdate) -> ProgrameResponse:
        try:
            program = self.repo.update_program(programe_id, data)
            program = self.repo.get_by_id_with_fees(program.id) or program
            semester_rows = self.repo.get_semesters_by_program_id(program.id)
            return self._serialize_program(program, semester_rows)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating program: {str(e)}",
            )
        
    def get_program_by_id_with_fees(self, programe_id: int) -> Programe:
        try:
            program = self.repo.get_by_id_with_fees(programe_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
            )
            semester_rows = self.repo.get_semesters_by_program_id(program.id)
            return self._serialize_program(program, semester_rows)
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

    def list_program_semesters(self, programe_id: int) -> ProgramSemesterResponse:
        try:
            program = self.repo.get_by_id(programe_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
                )

            semesters = self.repo.get_semesters_by_program_id(programe_id)
            if not semesters:
                semesters = self._generated_semester_rows(program)

            return ProgramSemesterResponse(
                program_id=self._value(program, "id"),
                program_code=self._value(program, "programe_code"),
                department_code=self._resolve_department_fields(program)[1],
                semesters=[
                    ProgramSemesterItem(
                        semester_no=semester["semester_no"],
                        semester_name=semester["semester_name"],
                    )
                    for semester in semesters
                ],
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching semesters: {str(e)}",
            )

    def update_program_payment_workflow(
        self,
        programe_id: int,
        payload: ProgramPaymentWorkflowUpdate
    ) -> ProgramPaymentWorkflowScopeOut:
        try:
            program = self.repo.get_by_id(programe_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
                )

            scope = self.repo.upsert_program_payment_workflow_scope(
                programe_id=programe_id,
                batch=payload.batch,
                admission_year=payload.admission_year,
                semester=payload.semester,
                enabled=payload.enabled,
            )
            # Sync workflow flag on matching students
            student_service = StudentService(self.repo.db)
            updated_count = student_service.sync_workflow_flag_for_scope(
                program_id=programe_id,
                batch=payload.batch,
                admission_year=payload.admission_year,
                semester=payload.semester,
                enabled=payload.enabled,
            )
            # Also ensure any other enabled scopes are reflected on students (one-way enable)
            student_service.sync_flags_from_enabled_scopes(program_id=programe_id)

            return ProgramPaymentWorkflowScopeOut.model_validate(scope)
        except HTTPException:
            raise
        except Exception as e:
            self.repo.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating payment workflow: {str(e)}",
            )

    def get_program_payment_workflow(
        self,
        programe_id: int,
        batch: str,
        admission_year: str,
        semester: str
    ) -> ProgramPaymentWorkflowScopeOut:
        program = self.repo.get_by_id(programe_id)
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

        scope = self.repo.get_program_payment_workflow_scope(
            programe_id=programe_id,
            batch=batch,
            admission_year=admission_year,
            semester=semester,
        )
        if not scope:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment workflow config not found for given program/batch/year/semester",
            )
        return ProgramPaymentWorkflowScopeOut.model_validate(scope)

    def upsert_program_payment_workflow_scope(
        self,
        programe_id: int,
        payload: ProgramPaymentWorkflowScopeUpsert
    ) -> ProgramPaymentWorkflowScopeOut:
        program = self.repo.get_by_id(programe_id)
        if not program:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Program not found",
            )

        scope = self.repo.upsert_program_payment_workflow_scope(
            programe_id=programe_id,
            batch=payload.batch,
            admission_year=payload.admission_year,
            semester=payload.semester,
            enabled=payload.enabled
        )
        return ProgramPaymentWorkflowScopeOut.model_validate(scope)

    def list_program_payment_workflow_scopes(
        self,
        programe_id: int = None
    ) -> ProgramPaymentWorkflowScopeListResponse:
        if programe_id is not None:
            program = self.repo.get_by_id(programe_id)
            if not program:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Program not found",
                )

        scopes = self.repo.list_program_payment_workflow_scopes(programe_id)
        data = [ProgramPaymentWorkflowScopeOut.model_validate(s) for s in scopes]
        message = "Program payment workflow scopes fetched successfully" if programe_id else "All program payment workflow scopes fetched successfully"
        return ProgramPaymentWorkflowScopeListResponse(
            message=message,
            code=status.HTTP_200_OK,
            status=True,
            data=data
        )
        
    # def _create_item(self, data, repo_get_method, repo_create_method, unique_field, out_model, response_model):
    #     existing = repo_get_method(getattr(data, unique_field))
    #     if existing:
    #         raise HTTPException(
    #             status_code=status.HTTP_409_CONFLICT,
    #             detail=f"{unique_field.replace('_', ' ').title()} '{getattr(data, unique_field)}' already exists.",
    #         )
        
    #     item = repo_create_method(data=data)

    #     obj_data = out_model.model_validate(item)

    #     return response_model(
    #         message=f"{unique_field.replace('_', ' ').title()} created successfully",
    #         code=status.HTTP_201_CREATED,
    #         status=True,
    #         data=obj_data
    #     )
    
    # def create_course_code(self, data: CourseCodeBase) -> CourseCodeResponse:
    #     return self._create_item(
    #         data=data,
    #         repo_get_method = self.repo.get_course_code,
    #         repo_create_method = lambda d: self.repo.create_fields(d, CourseCode, CourseCodeResponse),
    #         unique_field = "code",
    #         out_model = CourseCodeOut,
    #         response_model = CourseCodeResponse
    #     )

    def create_course_code(self, data: CourseCodeBase) -> CourseCodeResponse:
        
        existing = self.repo.get_course_code(data.code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course code '{data.code}' already exists.",
            )
        
        course_code = self.repo.create_fields(data=data, model=CourseCode, response_model=CourseCodeResponse)

        obj_data = CourseCodeOut.from_orm(course_code)

        return CourseCodeResponse(
            message="Course code created successfully",
            code=status.HTTP_201_CREATED,
            status=True,
            data=obj_data
        )
    
    def list_course_codes(self) -> List[CourseCodeList]:
        try:
            items = self.repo.get_all_course_codes()
            return [
                CourseCodeList(
                    message="Course codes retrieved successfully",
                    code=status.HTTP_200_OK,
                    status=True,
                    data=[CourseCodeOut.from_orm(item) for item in items]
                )
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing course codes: {str(e)}",
            )
    
    def create_course_category(self, data: CourseCategoryBase) -> CourseCategoryResponse:
        
        existing = self.repo.get_course_category(data.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course category '{data.name}' already exists.",
            )
        
        course_category = self.repo.create_fields(data=data, model=CourseCategory, response_model=CourseCategoryResponse)

        return CourseCategoryResponse(
            message="Course category created successfully",
            code=status.HTTP_201_CREATED,
            status=True,
            data=course_category
        )
    
    def list_course_category(self) -> List[CourseCategoryList]:
        try:
            items = self.repo.get_all_course_category()
            return [
                CourseCategoryList(
                    message="Course codes retrieved successfully",
                    code=status.HTTP_200_OK,
                    status=True,
                    data=[CourseCategoryOut.from_orm(item) for item in items]
                )
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing course codes: {str(e)}",
            )
    
    def create_course_title(self, data: CourseTitleBase) -> CourseTitleResponse:
        
        existing = self.repo.get_course_title(data.title)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course title '{data.title}' already exists.",
            )
        
        course_title = self.repo.create_fields(data=data, model=CourseTitle, response_model=CourseTitleResponse)

        return CourseTitleResponse(
            message="Course title created successfully",
            code=status.HTTP_201_CREATED,
            status=True,
            data=course_title
        )
    
    def list_course_Title(self) -> List[CourseTitleList]:
        try:
            items = self.repo.get_all_course_title()
            return [
                CourseTitleList(
                    message="Course codes retrieved successfully",
                    code=status.HTTP_200_OK,
                    status=True,
                    data=[CourseTitleOut.from_orm(item) for item in items]
                )
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing course codes: {str(e)}",
            )
    
    def create_syllabus(self, data: SyllabusCreate) -> SyllabusResponse:
        try:
            existing = self.repo.get_syllabus(
                course_code_id=data.course_code_id,
                course_category_id=data.course_category_id,
                course_title_id=data.course_title_id
            )
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Syllabus with the given course code, category, and title already exists.",
                )
            
            syllabus = self.repo.create_fields(data=data, model=Subjects, response_model=SyllabusResponse)

            return SyllabusResponse(
                message="Syllabus created successfully",
                code=status.HTTP_201_CREATED,
                status=True,
                data=[syllabus]
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while creating syllabus: {str(e)}",
            )

    def list_syllabuses(self) -> List[SyllabusResponse]:
        try:
            items = self.repo.get_all_syllabuses()

            data_list = [SyllabusOut.from_orm(item) for item in items]

            return [
                SyllabusResponse(
                    message="Syllabuses retrieved successfully",
                    code=status.HTTP_200_OK,
                    status=True,
                    data=data_list
                ) 
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing syllabuses: {str(e)}",
            )
        
    def create_department(self, data: DepartmentBase) -> DepartmentResponse:
        try:
            department_code = data.department_code.strip()
            if not department_code:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department code is required.",
                )

            existing = self.repo.get_department_by_name(data.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Department '{data.name}' already exists.",
                )

            existing_code = self.repo.get_department_by_code(department_code)
            if existing_code:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Department code '{department_code}' already exists.",
                )

            data.department_code = department_code
            
            department = self.repo.create_fields(data=data, model=Department, response_model=DepartmentOut)

            response = DepartmentResponse(
                message="Department created successfully",
                code=201,
                status=True,
                data=department
            )

            return response

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while creating department: {str(e)}",
            )
        
    def list_departments(self) -> List[DepartmentList]:
        try:
            items = self.repo.get_all_departments()
            data = [DepartmentOut.from_orm(item) for item in items]
            lis = DepartmentList(
                message="Departments retrieved successfully",
                code=status.HTTP_200_OK,
                status=True,
                data=data
            )
            return lis
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing departments: {str(e)}",
            )
        
    def get_department_by_id(self, department_id: int) -> DepartmentOut:
        try:
            department = self.repo.get_department_by_id(department_id)
            if not department:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Department not found",
                )
            return DepartmentOut.from_orm(department)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching department: {str(e)}",
            )
        
    def update_department(self, department_id: int, data: DepartmentUpdate) -> DepartmentUpdateResponse:
        try:
            if data.department_code is not None:
                department_code = data.department_code.strip()
                if not department_code:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Department code cannot be empty.",
                    )

                existing_code = self.repo.get_department_by_code(department_code)
                if existing_code and existing_code.id != department_id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Department code '{department_code}' already exists.",
                    )
                data.department_code = department_code
            updated_department = self.repo.update_department(department_id, data.dict(exclude_unset=True))
            return DepartmentUpdateResponse(
                message="Department updated successfully",
                code=status.HTTP_200_OK,
                status=True,
                data=updated_department
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating department: {str(e)}",
            )
        
    def delete_department(self, department_id: int) -> DepartmentDeleteResponse:
        try:
            self.repo.delete_department(department_id)
            return DepartmentDeleteResponse(
                message="Department deleted successfully",
                code=status.HTTP_200_OK,
                status=True
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while deleting department: {str(e)}",
            )

    # ------- Academic Year Services -------
    def create_academic_year(self, data) -> AcademicYearResponse:
        try:
            academic_year = self.repo.create_academic_year(data.dict())
            return AcademicYearResponse.model_validate(academic_year)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while creating academic year: {str(e)}",
            )

    def get_academic_year(self, academic_year_id: int) -> AcademicYearResponse:
        try:
            academic_year = self.repo.get_academic_year_by_id(academic_year_id)
            if not academic_year:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Academic year not found"
                )
            return AcademicYearResponse.model_validate(academic_year)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching academic year: {str(e)}",
            )

    def list_academic_years(self) -> List[AcademicYearResponse]:
        try:
            academic_years = self.repo.get_all_academic_years()
            return [AcademicYearResponse.model_validate(ay) for ay in academic_years]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing academic years: {str(e)}",
            )

    def update_academic_year(self, academic_year_id: int, data) -> AcademicYearResponse:
        try:
            academic_year = self.repo.update_academic_year(academic_year_id, data.dict(exclude_unset=True))
            if not academic_year:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Academic year not found"
                )
            return AcademicYearResponse.model_validate(academic_year)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating academic year: {str(e)}",
            )

    def delete_academic_year(self, academic_year_id: int) -> dict:
        try:
            success = self.repo.delete_academic_year(academic_year_id)
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Academic year not found"
                )
            return {"message": "Academic year deleted successfully", "status": True}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while deleting academic year: {str(e)}",
            )

    # ------- Batch Services -------
    def create_batch(self, data) -> BatchResponse:
        try:
            batch = self.repo.create_batch(data.dict())
            return BatchResponse.model_validate(batch)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while creating batch: {str(e)}",
            )

    def get_batch(self, batch_id: int) -> BatchResponse:
        try:
            batch = self.repo.get_batch_by_id(batch_id)
            if not batch:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Batch not found"
                )
            return BatchResponse.model_validate(batch)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching batch: {str(e)}",
            )

    def list_batches_by_academic_year(self, academic_year_id: int) -> List[BatchResponse]:
        try:
            batches = self.repo.get_batches_by_academic_year(academic_year_id)
            return [BatchResponse.model_validate(b) for b in batches]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing batches: {str(e)}",
            )

    def list_all_batches(self) -> List[BatchResponse]:
        try:
            batches = self.repo.get_all_batches()
            return [BatchResponse.model_validate(b) for b in batches]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing batches: {str(e)}",
            )

    def update_batch(self, batch_id: int, data) -> BatchResponse:
        try:
            batch = self.repo.update_batch(batch_id, data.dict(exclude_unset=True))
            if not batch:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Batch not found"
                )
            return BatchResponse.model_validate(batch)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating batch: {str(e)}",
            )

    def delete_batch(self, batch_id: int) -> dict:
        try:
            success = self.repo.delete_batch(batch_id)
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Batch not found"
                )
            return {"message": "Batch deleted successfully", "status": True}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while deleting batch: {str(e)}",
            )

    # ------- Semester Master Services -------
    def create_semester_master(self, data) -> SemesterMasterResponse:
        try:
            semester = self.repo.create_semester_master(data.dict())
            return SemesterMasterResponse.model_validate(semester)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while creating semester: {str(e)}",
            )

    def get_semester_master(self, semester_id: int) -> SemesterMasterResponse:
        try:
            semester = self.repo.get_semester_master_by_id(semester_id)
            if not semester:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Semester not found"
                )
            return SemesterMasterResponse.model_validate(semester)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while fetching semester: {str(e)}",
            )

    def list_semesters_by_program_type(self, program_type: str) -> List[SemesterMasterResponse]:
        try:
            semesters = self.repo.get_semesters_by_program_type(program_type)
            return [SemesterMasterResponse.model_validate(s) for s in semesters]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing semesters: {str(e)}",
            )

    def list_all_semester_masters(self) -> List[SemesterMasterResponse]:
        try:
            semesters = self.repo.get_all_semester_masters()
            return [SemesterMasterResponse.model_validate(s) for s in semesters]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing semesters: {str(e)}",
            )

    def update_semester_master(self, semester_id: int, data) -> SemesterMasterResponse:
        try:
            semester = self.repo.update_semester_master(semester_id, data.dict(exclude_unset=True))
            if not semester:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Semester not found"
                )
            return SemesterMasterResponse.model_validate(semester)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while updating semester: {str(e)}",
            )

    def delete_semester_master(self, semester_id: int) -> dict:
        try:
            success = self.repo.delete_semester_master(semester_id)
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Semester not found"
                )
            return {"message": "Semester deleted successfully", "status": True}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while deleting semester: {str(e)}",
            )
