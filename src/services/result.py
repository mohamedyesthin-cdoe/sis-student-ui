from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from src.models.academic import *
from src.models.exam import *


class MarksEntryService:

    def __init__(self, db: Session):
        self.db = db

    # ---------------------------------------------------------
    # ENTER MARKS (CIA / ESE)
    # ---------------------------------------------------------

    def enter_marks(self, data: dict):

        student_id = data["student_id"]
        exam_id = data["exam_id"]
        course_id = data["course_id"]
        component_id = data["component_id"]
        marks = data["marks_obtained"]
        staff_id = data["entered_by"]

        # Check component
        component = self.db.query(CourseComponent).filter(
            CourseComponent.id == component_id
        ).first()

        if not component:
            raise HTTPException(status_code=404, detail="Component not found")

        # Prevent editing if locked
        existing = self.db.query(MarksEntry).filter(
            MarksEntry.student_id == student_id,
            MarksEntry.exam_id == exam_id,
            MarksEntry.course_id == course_id,
            MarksEntry.component_id == component_id
        ).first()

        if existing and existing.is_locked:
            raise HTTPException(status_code=400, detail="Marks already locked")

        if existing:
            existing.marks_obtained = marks
            self.db.commit()
        else:
            entry = MarksEntry(
                student_id=student_id,
                exam_id=exam_id,
                course_id=course_id,
                component_id=component_id,
                marks_obtained=marks,
                entered_by=staff_id
            )
            self.db.add(entry)
            self.db.commit()

        # If ESE entered → calculate result
        if component.component_type == "ESE":
            self.calculate_course_result(student_id, exam_id, course_id)

        return {"success": True, "message": "Marks saved successfully"}

    # ---------------------------------------------------------
    # COURSE RESULT CALCULATION
    # ---------------------------------------------------------

    def calculate_course_result(self, student_id, exam_id, course_id):

        entries = self.db.query(MarksEntry).filter(
            MarksEntry.student_id == student_id,
            MarksEntry.exam_id == exam_id,
            MarksEntry.course_id == course_id
        ).all()

        if not entries:
            return

        total_marks = sum(e.marks_obtained for e in entries)

        percentage = total_marks  # assuming out of 100

        # PASS RULE (Example: 40 minimum)
        if total_marks >= 40:
            result_status = "PASS"
        else:
            result_status = "FAIL"

        grade, grade_point = self.get_grade(percentage)

        # Save result (single record per course)
        result = CourseResult(
            student_id=student_id,
            exam_id=exam_id,
            course_id=course_id,
            component_id=entries[0].component_id,  # optional adjustment
            total_marks=total_marks,
            result_status=result_status,
            percentage=percentage,
            grade=grade,
            grade_point=grade_point,
            computed_at=datetime.utcnow()
        )

        self.db.add(result)
        self.db.commit()

        # After course result → compute semester result
        self.calculate_semester_result(student_id, exam_id)

    # ---------------------------------------------------------
    # SEMESTER RESULT
    # ---------------------------------------------------------

    def calculate_semester_result(self, student_id, exam_id):

        results = self.db.query(CourseResult).filter(
            CourseResult.student_id == student_id,
            CourseResult.exam_id == exam_id
        ).all()

        if not results:
            return

        total_points = 0
        total_credits = 0
        earned_credits = 0

        for r in results:
            course = self.db.query(Course).filter(
                Course.id == r.course_id
            ).first()

            credits = course.credits

            total_credits += credits
            total_points += r.grade_point * credits

            if r.result_status == "PASS":
                earned_credits += credits

        sgpa = round(total_points / total_credits, 2) if total_credits else 0

        if earned_credits == total_credits:
            semester_status = "PASS"
        else:
            semester_status = "FAIL"

        semester_result = SemesterResult(
            student_id=student_id,
            exam_id=exam_id,
            semester_id=course.semester_id,
            total_credits=total_credits,
            earned_credits=earned_credits,
            sgpa=sgpa,
            result_status=semester_status
        )

        self.db.add(semester_result)
        self.db.commit()

    # ---------------------------------------------------------
    # GRADE LOGIC
    # ---------------------------------------------------------

    def get_grade(self, percentage):

        if percentage >= 90:
            return "O", 10
        elif percentage >= 80:
            return "A+", 9
        elif percentage >= 70:
            return "A", 8
        elif percentage >= 60:
            return "B+", 7
        elif percentage >= 50:
            return "B", 6
        elif percentage >= 40:
            return "C", 5
        else:
            return "F", 0
