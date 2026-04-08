from sqlalchemy.orm import Session, joinedload
from typing import List
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.models.exam import *
from src.models.academic import *
from src.models.students import Student

class ExamRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_exam(self, exam_data: dict) -> Exam:
        try:
            exam = Exam(**exam_data)
            self.db.add(exam)
            self.db.commit()
            self.db.refresh(exam)
            return exam

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_exam(self, exam_id: int) -> Exam | None:
        return (
            self.db.query(Exam)
            .filter(Exam.id == exam_id)
            .first()
        )

    def update_exam(self, exam_id: int, update_data: dict) -> Exam | None:
        exam = self.get_exam(exam_id)
        if not exam:
            return None

        try:
            for key, value in update_data.items():
                if hasattr(exam, key):   # 🔒 protect model
                    setattr(exam, key, value)

            self.db.commit()
            self.db.refresh(exam)
            return exam

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete_exam(self, exam_id: int) -> bool:
        exam = self.get_exam(exam_id)
        if not exam:
            return False

        try:
            self.db.delete(exam)
            self.db.commit()
            return True
        except SQLAlchemyError:
            self.db.rollback()
            raise

    def list_exams(self) -> list[Exam]:
        return self.db.query(Exam).all()
    
class ExamTimeTableRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_timetable(self, timetable_data: dict) -> ExamTimeTable:
        try:
            timetable = ExamTimeTable(**timetable_data)
            self.db.add(timetable)
            self.db.commit()
            self.db.refresh(timetable)
            return timetable

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise  

    def get_timetable(self, timetable_id: int) -> ExamTimeTable | None:
        return (
            self.db.query(ExamTimeTable)
            .filter(ExamTimeTable.id == timetable_id)
            .first()
        )
    
    def update_timetable(self, timetable_id: int, update_data: dict) -> ExamTimeTable | None:
        timetable = self.get_timetable(timetable_id)
        if not timetable:
            return None

        try:
            for key, value in update_data.items():
                if hasattr(timetable, key):   # 🔒 protect model
                    setattr(timetable, key, value)

            self.db.commit()
            self.db.refresh(timetable)
            return timetable

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete_timetable(self, timetable_id: int) -> bool:
        timetable = self.get_timetable(timetable_id)
        if not timetable:
            return False

        try:
            self.db.delete(timetable)
            self.db.commit()
            return True
        except SQLAlchemyError:
            self.db.rollback()
            raise

    def list_timetables(self) -> list[ExamTimeTable]:
        return self.db.query(ExamTimeTable).all()

class ExamRegistrationRepository:

    def __init__(self, db: Session):
        self.db = db

    # ---------------- EXAM REGISTRATION ---------------- #

    def exam_registration_exists(self, student_id: int, exam_id: int) -> bool:
        return self.db.query(StudentExamRegistration).filter(
            StudentExamRegistration.student_id == student_id,
            StudentExamRegistration.exam_id == exam_id
        ).first() is not None

    def create_registration(
        self,
        registration_data: dict,
        commit: bool = True
    ) -> StudentExamRegistration:
        try:
            registration = StudentExamRegistration(**registration_data)
            self.db.add(registration)

            if commit:
                self.db.commit()
                self.db.refresh(registration)
            else:
                self.db.flush()  # gets ID without commit

            return registration

        except (IntegrityError, SQLAlchemyError):
            self.db.rollback()
            raise

    # ---------------- MASTER DATA ---------------- #

    def get_courses_by_semester(self, semester_id: int) -> List[Course]:
        return (
            self.db.query(Course)
            .filter(Course.semester_id == semester_id)
            .all()
        )

    # ---------------- ACADEMIC HISTORY ---------------- #

    def get_arrear_component_ids(self, student_id: int) -> list[int]:
        rows = (
            self.db.query(CourseResult.component_id)
            .filter(
                CourseResult.student_id == student_id,
                CourseResult.result_status == "FAIL"
            )
            .all()
        )

        return [r[0] for r in rows]

    def get_students_by_semester(self, semester_id: int) -> list[Student]:
        return (
            self.db.query(Student)
            .filter(Student.semester_id == semester_id)
            .all()
        )
    
    def get_semester_by_id(self, semester_id: int):
        return self.db.query(Semester).filter(Semester.id == semester_id).first()
    
    def exam_registration_exists(self, student_id: int, exam_id: int) -> bool:
        return self.db.query(StudentExamRegistration).filter(
            StudentExamRegistration.student_id == student_id,
            StudentExamRegistration.exam_id == exam_id
        ).first() is not None
    
    # ---------------- COURSE REGISTRATION ---------------- #

    def bulk_course_registration(
        self,
        registrations: list[StudentCourseRegistration],
        commit: bool = True
    ) -> list[StudentCourseRegistration]:
        try:
            self.db.add_all(registrations)

            if commit:
                self.db.commit()

            return registrations

        except (IntegrityError, SQLAlchemyError):
            self.db.rollback()
            raise

    # ---------------- TRANSACTION CONTROL ---------------- #

    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()
