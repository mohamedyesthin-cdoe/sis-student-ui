from sqlalchemy.orm import Session
from src.repositories.master import MasterRepository
from src.models.master import Programe, CourseCode, CourseCategory, CourseTitle, SemesterSyllabus
from src.schemas.master import *
from fastapi import HTTPException, status
from typing import List

class MasterService:
    def __init__(self, db: Session):
        self.repo = MasterRepository(db)

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
            
            syllabus = self.repo.create_fields(data=data, model=SemesterSyllabus, response_model=SyllabusResponse)

            return SyllabusResponse(
                message="Syllabus created successfully",
                code=status.HTTP_201_CREATED,
                status=True,
                data=syllabus
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
            return [
                SyllabusResponse(
                    message="Syllabuses retrieved successfully",
                    code=status.HTTP_200_OK,
                    status=True,
                    data=SyllabusOut.from_orm(item)
                ) for item in items
            ]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error while listing syllabuses: {str(e)}",
            )