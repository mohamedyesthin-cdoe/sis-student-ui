from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.schemas.exam import ExamRegistrationResponse
from src.models.exam import Exam, ExamTimeTable
from src.repositories.exam import *

class ExamService:
    def __init__(self, db: Session):
        self.exam_repo = ExamRepository(db)

    def create_exam(self, exam_data) -> Exam:
        data = exam_data.dict() if hasattr(exam_data, "dict") else exam_data
        return self.exam_repo.create_exam(data)

    def get_exam(self, exam_id: int) -> Exam:
        exam = self.exam_repo.get_exam(exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        return exam

    def update_exam(self, exam_id: int, update_data: dict) -> Exam:
        exam = self.exam_repo.update_exam(exam_id, update_data)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        return exam

    def delete_exam(self, exam_id: int) -> bool:
        success = self.exam_repo.delete_exam(exam_id)
        if not success:
            raise HTTPException(status_code=404, detail="Exam not found")
        return success
    
    def list_exams(self) -> list[Exam]:
        return self.exam_repo.list_exams()
    
class ExamTimeTableService:
    def __init__(self, db: Session):
        self.exam_repo = ExamTimeTableRepository(db)

    def create_timetable(self, timetable_data) -> ExamTimeTable:
        data = timetable_data.dict() if hasattr(timetable_data, "dict") else timetable_data
        return self.exam_repo.create_timetable(data)
    
    def get_timetable(self, timetable_id: int) -> ExamTimeTable:
        timetable = self.exam_repo.get_timetable(timetable_id)
        if not timetable:
            raise HTTPException(status_code=404, detail="Exam timetable not found")
        return timetable
    
    def list_timetables(self) -> list[ExamTimeTable]:
        return self.exam_repo.list_timetables()
    
    def update_timetable(self, timetable_id: int, update_data: dict) -> ExamTimeTable:
        timetable = self.exam_repo.update_timetable(timetable_id, update_data)
        if not timetable:
            raise HTTPException(status_code=404, detail="Exam timetable not found")
        return timetable
    
    def delete_timetable(self, timetable_id: int) -> bool:
        success = self.exam_repo.delete_timetable(timetable_id)
        if not success:
            raise HTTPException(status_code=404, detail="Exam timetable not found")
        return success
    
class RegistrationExamService:

    def __init__(self, db: Session):
        self.exam_repo = ExamRegistrationRepository(db)

    def auto_register_students_for_exam(self, registration_data) -> dict:
        data = registration_data.dict() if hasattr(registration_data, "dict") else registration_data

        exam_id = data["exam_id"]
        semester_id = data["semester_id"]
        
        try:
            # 1️⃣ Get all students of this semester
            students = self.exam_repo.get_students_by_semester(semester_id)

            total_registrations = 0

            for student in students:

                # Skip if already registered
                if self.exam_repo.exam_registration_exists(student.id, exam_id):
                    continue
                
                scheme_id = self.exam_repo.get_semester_by_id(semester_id)

                # 2️⃣ Create Exam Registration
                exam_registration = self.exam_repo.create_registration({
                    "student_id": student.id,
                    "exam_id": exam_id,
                    "semester_id": semester_id,
                    "scheme_id": scheme_id.scheme_id,
                }, commit=False)

                # 3️⃣ Get Arrear Components
                arrear_component_ids = self.exam_repo.get_arrear_component_ids(student.id)

                # 4️⃣ Get Current Semester Courses
                courses = self.exam_repo.get_courses_by_semester(semester_id)

                component_registrations = []

                for course in courses:
                    for component in course.components:

                        is_arrear = component.id in arrear_component_ids

                        # Register BOTH regular + arrear
                        component_registrations.append(
                            StudentCourseRegistration(
                                student_exam_registration_id=exam_registration.id,
                                course_id=course.id,
                                component_id=component.id,
                                is_arrear=is_arrear,
                                permitted=True
                            )
                        )

                if component_registrations:
                    self.exam_repo.bulk_course_registration(
                        component_registrations,
                        commit=False
                    )

                total_registrations += 1

            self.exam_repo.commit()

            return {
                "success": True,
                "message": "All students auto registered successfully",
                "total_students_registered": total_registrations
            }

        except Exception:
            self.exam_repo.rollback()
            raise

    def register_student_for_exam(self, registration_data) -> dict:
        data = registration_data.dict() if hasattr(registration_data, "dict") else registration_data

        student_id = data["student_id"]
        exam_id = data["exam_id"]
        semester_id = data["semester_id"]

        # Prevent duplicate exam registration
        if self.exam_repo.exam_registration_exists(student_id, exam_id):
            raise HTTPException(
                status_code=400,
                detail="Student already registered for this exam"
            )

        try:
            # Start transaction
            exam_registration = self.exam_repo.create_registration(data, commit=False)

            # Fetch arrear components
            arrear_component_ids = self.exam_repo.get_arrear_component_ids(student_id)

            # Fetch semester courses
            courses = self.exam_repo.get_courses_by_semester(semester_id)

            course_registrations: list[StudentCourseRegistration] = []

            for course in courses:
                for component in course.components:
                    is_arrear = component.id in arrear_component_ids

                    # If student has arrears → register ONLY arrears
                    if arrear_component_ids and not is_arrear:
                        continue

                    course_registrations.append(
                        StudentCourseRegistration(
                            student_exam_registration_id=exam_registration.id,
                            course_id=course.id,
                            component_id=component.id,
                            is_arrear=is_arrear,
                            permitted=True
                        )
                    )

            # Save component registrations
            if course_registrations:
                self.exam_repo.bulk_course_registration(course_registrations, commit=False)

            # Commit everything once
            self.exam_repo.commit()

            return ExamRegistrationResponse(
                success=True,
                exam_registration_id=exam_registration.id,
                registered_courses=len(course_registrations)
            )

        except Exception:
            self.exam_repo.rollback()
            raise

