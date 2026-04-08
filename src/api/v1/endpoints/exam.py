from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.services.exam import *
from src.db.session import get_db  
from src.schemas.exam import *
from src.models.user import User
from src.core.security.dependencies import require_superuser

router = APIRouter()

@router.post("/exams", response_model=ExamResponse, tags=["Exams"])
def create_exam(exam_data: ExamCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamService(db)
    return service.create_exam(exam_data) 

@router.get("/exams/{exam_id}", tags=["Exams"])
def get_exam(exam_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamService(db)
    return service.get_exam(exam_id)

@router.put("/exams/{exam_id}", response_model=ExamResponse, tags=["Exams"])
def update_exam(exam_id: int, update_data: ExamUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamService(db)
    update_dict = update_data.model_dump(exclude_unset=True)
    return service.update_exam(exam_id, update_dict)

@router.delete("/exams/{exam_id}", tags=["Exams"])
def delete_exam(exam_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamService(db)
    return service.delete_exam(exam_id) 

@router.get("/exams", tags=["Exams"])
def list_exams(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamService(db)
    return service.list_exams() 

@router.post("/exam-timetables", response_model=ExamTimeTableResponse, tags=["Exam Timetables"])
def create_exam_timetable(timetable_data: ExamTimeTableCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamTimeTableService(db)
    return service.create_timetable(timetable_data)

@router.get("/exam-timetables/{timetable_id}", tags=["Exam Timetables"])
def get_exam_timetable(timetable_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamTimeTableService(db)
    return service.get_timetable(timetable_id)  

@router.get("/exam-timetables", tags=["Exam Timetables"])
def list_exam_timetables(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamTimeTableService(db)
    return service.list_timetables()    

@router.put("/exam-timetables/{timetable_id}", response_model=ExamTimeTableResponse, tags=["Exam Timetables"])
def update_exam_timetable(timetable_id: int, update_data: ExamTimeTableUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamTimeTableService(db)
    update_dict = update_data.model_dump(exclude_unset=True)
    return service.update_timetable(timetable_id, update_dict)

@router.delete("/exam-timetables/{timetable_id}", tags=["Exam Timetables"])
def delete_exam_timetable(timetable_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    service = ExamTimeTableService(db)
    return service.delete_timetable(timetable_id)

@router.post("/exam-registrations", response_model=ExamRegistrationResponse, tags=["Exam Registrations"])
def register_student_for_exam(registration_data: ExamRegistrationBase, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = RegistrationExamService(db)
        return service.auto_register_students_for_exam(registration_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


