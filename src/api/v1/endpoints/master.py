from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from src.services.master import MasterService
from src.models.user import User
from src.schemas.master import *
from src.db.session import get_db
from src.core.security.dependencies import require_superuser
from src.core.security.jwt import verify_api_key

router = APIRouter()

@router.post("/programe/add", response_model=ProgrameResponse)
def create_program(programe: ProgrameCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.create_program(programe)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/programe/list", response_model=List[ProgrameResponse])
def list_programs(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_programs()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )

@router.put("/programe/update/{id}", response_model=ProgrameResponse)
def update_program(id: int, programe_data: ProgrameUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.update_programe(id, programe_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        ) 


@router.put(
    "/programe/{programe_id}/pending-payment-workflow",
    response_model=ProgramPaymentWorkflowScopeOut
)
def update_program_pending_payment_workflow(
    programe_id: int,
    payload: ProgramPaymentWorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser)
):
    try:
        service = MasterService(db)
        return service.update_program_payment_workflow(programe_id=programe_id, payload=payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get(
    "/programe/{programe_id}/pending-payment-workflow",
    response_model=ProgramPaymentWorkflowScopeOut
)
def get_program_pending_payment_workflow(
    programe_id: int,
    batch: str,
    admission_year: str,
    semester: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser)
):
    try:
        service = MasterService(db)
        return service.get_program_payment_workflow(
            programe_id=programe_id,
            batch=batch,
            admission_year=admission_year,
            semester=semester
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get(
    "/programe/pending-payment-workflow/list",
    response_model=ProgramPaymentWorkflowScopeListResponse
)
def list_program_pending_payment_workflow_scopes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser)
):
    try:
        service = MasterService(db)
        return service.list_program_payment_workflow_scopes(programe_id=None)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/programe/{programe_id}", response_model=ProgrameResponse)
def get_program_by_id(programe_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        program = service.get_program_by_id_with_fees(programe_id)
        return program
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
@router.get("/Offering/{programe_id}", response_model=OfferingResponse, dependencies=[Depends(verify_api_key)])
def get_program_by_id(programe_id: int, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        program = service.get_program_by_id_with_fees(programe_id)
        return program
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )
    
# @router.post("/coursecode/add", response_model=CourseCodeResponse)
# def create_course_code(course_code: CourseCodeBase, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.create_course_code(course_code)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.get("/coursecode/list", response_model=List[CourseCodeList])
# def list_course_codes(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.list_course_codes()
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.post("/coursecategory/add", response_model=CourseCategoryResponse)
# def create_course_category(course_code: CourseCategoryBase, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.create_course_category(course_code)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.get("/coursecategory/list", response_model=List[CourseCategoryList])
# def list_course_category(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.list_course_category()
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.post("/coursetitle/add", response_model=CourseTitleResponse)
# def create_course_title(course_code: CourseTitleBase, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.create_course_title(course_code)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.get("/coursetitle/list", response_model=List[CourseTitleList])
# def list_course_title(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.list_course_Title()
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.post("/syllabus/add", response_model=SyllabusResponse)
# def create_syllabus(syllabus: SyllabusCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.create_syllabus(syllabus)
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
# @router.get("/syllabus/list", response_model=List[SyllabusResponse])
# def list_syllabuses(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
#     try:
#         service = MasterService(db)
#         return service.list_syllabuses()
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Unexpected error in endpoint: {str(e)}",
#         )
    
@router.post("/department/add", response_model = DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_roles(department: DepartmentBase, db:Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.create_department(department)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )

@router.get("/department/list", response_model=DepartmentList, status_code=status.HTTP_200_OK)
async def list_departments(db:Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_departments()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error while listing departments: {str(e)}",
        )

@router.get("/department/{department_id}", response_model=DepartmentOut, status_code=status.HTTP_200_OK)
async def get_department(department_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.get_department_by_id(department_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error while fetching department: {str(e)}",
        )

@router.put("/department/update/{department_id}", response_model=DepartmentUpdateResponse, status_code=status.HTTP_200_OK)
async def update_department(department_id: int, department_update: DepartmentUpdate, db: Session = Depends(get_db)):
    try:
        service = MasterService(db)
        return service.update_department(department_id, department_update)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error while updating department: {str(e)}",
        )
@router.delete(
    "/department/delete/{department_id}",
    response_model=DepartmentDeleteResponse,
    status_code=status.HTTP_200_OK
)
async def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser)
):
    try:
        service = MasterService(db)
        return service.delete_department(department_id)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


# ------- Academic Year Endpoints -------
@router.post("/academic-year/add", response_model=AcademicYearResponse, status_code=status.HTTP_201_CREATED)
def create_academic_year(data: AcademicYearCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.create_academic_year(data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/academic-year/list", response_model=List[AcademicYearResponse])
def list_academic_years(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_academic_years()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/academic-year/{academic_year_id}", response_model=AcademicYearResponse)
def get_academic_year(academic_year_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.get_academic_year(academic_year_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.put("/academic-year/update/{academic_year_id}", response_model=AcademicYearResponse)
def update_academic_year(academic_year_id: int, data: AcademicYearUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.update_academic_year(academic_year_id, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.delete("/academic-year/delete/{academic_year_id}", status_code=status.HTTP_200_OK)
def delete_academic_year(academic_year_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.delete_academic_year(academic_year_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


# ------- Batch Endpoints -------
@router.post("/batch/add", response_model=BatchResponse, status_code=status.HTTP_201_CREATED)
def create_batch(data: BatchCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.create_batch(data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/batch/list", response_model=List[BatchResponse])
def list_all_batches(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_all_batches()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/batch/by-year/{academic_year_id}", response_model=List[BatchResponse])
def list_batches_by_year(academic_year_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.list_batches_by_academic_year(academic_year_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.get("/batch/{batch_id}", response_model=BatchResponse)
def get_batch(batch_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.get_batch(batch_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.put("/batch/update/{batch_id}", response_model=BatchResponse)
def update_batch(batch_id: int, data: BatchUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.update_batch(batch_id, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )


@router.delete("/batch/delete/{batch_id}", status_code=status.HTTP_200_OK)
def delete_batch(batch_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = MasterService(db)
        return service.delete_batch(batch_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error in endpoint: {str(e)}",
        )



