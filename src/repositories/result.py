from sqlalchemy.orm import Session
from typing import List
from src.models.academic import *
from src.models.exam import *


class MarksRepository:

    def __init__(self, db: Session):
        self.db = db

    # ---------------------------------------------------------
    # COMPONENT
    # ---------------------------------------------------------

    # def get_component(self, component_id: int):
        # return self.db.query(CourseComponent).filter(
        #     CourseComponent.id == component_id
        # ).first()

    # ---------------------------------------------------------
    # MARKS ENTRY
    # ---------------------------------------------------------

    def get_marks_entry(
        self,
        student_id: int,
        exam_id: int,
        course_id: int,
        component_id: int
    ):
        return self.db.query(MarksEntry).filter(
            MarksEntry.student_id == student_id,
            MarksEntry.exam_id == exam_id,
            MarksEntry.course_id == course_id,
            MarksEntry.component_id == component_id
        ).first()

    def create_marks_entry(self, data: dict, commit: bool = True):
        entry = MarksEntry(**data)
        self.db.add(entry)

        if commit:
            self.db.commit()
            self.db.refresh(entry)
        else:
            self.db.flush()

        return entry

    def update_marks(self, entry: MarksEntry, marks: float, commit: bool = True):
        entry.marks_obtained = marks

        if commit:
            self.db.commit()

    def get_course_marks(
        self,
        student_id: int,
        exam_id: int,
        course_id: int
    ) -> List[MarksEntry]:
        return self.db.query(MarksEntry).filter(
            MarksEntry.student_id == student_id,
            MarksEntry.exam_id == exam_id,
            MarksEntry.course_id == course_id
        ).all()

    # ---------------------------------------------------------
    # COURSE RESULT
    # ---------------------------------------------------------

    def create_course_result(self, data: dict, commit: bool = True):
        result = CourseResult(**data)
        self.db.add(result)

        if commit:
            self.db.commit()
            self.db.refresh(result)
        else:
            self.db.flush()

        return result

    def get_course_results_by_exam(
        self,
        student_id: int,
        exam_id: int
    ) -> List[CourseResult]:
        return self.db.query(CourseResult).filter(
            CourseResult.student_id == student_id,
            CourseResult.exam_id == exam_id
        ).all()

    # ---------------------------------------------------------
    # COURSE DETAILS
    # ---------------------------------------------------------

    def get_course(self, course_id: int):
        return self.db.query(Course).filter(
            Course.id == course_id
        ).first()

    # ---------------------------------------------------------
    # SEMESTER RESULT
    # ---------------------------------------------------------

    def create_semester_result(self, data: dict, commit: bool = True):
        result = SemesterResult(**data)
        self.db.add(result)

        if commit:
            self.db.commit()
            self.db.refresh(result)
        else:
            self.db.flush()

        return result

    def get_existing_semester_result(
        self,
        student_id: int,
        exam_id: int,
        semester_id: int
    ):
        return self.db.query(SemesterResult).filter(
            SemesterResult.student_id == student_id,
            SemesterResult.exam_id == exam_id,
            SemesterResult.semester_id == semester_id
        ).first()

    # ---------------------------------------------------------
    # TRANSACTION CONTROL
    # ---------------------------------------------------------

    def commit(self):
        self.db.commit()

    def rollback(self):
        self.db.rollback()
