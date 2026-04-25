from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.models.academic import *

class SemesterRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_semester(self, semester_data: dict) -> Semester:
        try:
            semester = Semester(**semester_data)
            self.db.add(semester)
            self.db.commit()
            self.db.refresh(semester)
            return semester

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_semester(self, semester_id: int) -> Semester | None:
        return (
            self.db.query(Semester)
            .filter(Semester.id == semester_id)
            .first()
        )
    
    def update_semester(self, semester_id: int, update_data: dict) -> Semester | None:
        semester = self.get_semester(semester_id)
        if not semester:
            return None

        try:
            for key, value in update_data.items():
                if hasattr(semester, key):   # 🔒 protect model
                    setattr(semester, key, value)

            self.db.commit()
            self.db.refresh(semester)
            return semester

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete_semester(self, semester_id: int) -> bool:
        semester = self.get_semester(semester_id)
        if not semester:
            return False

        try:
            self.db.delete(semester)
            self.db.commit()
            return True

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def list_semesters(self) -> list[Semester]:
        from sqlalchemy.orm import joinedload
        query = self.db.query(Semester).options(
            joinedload(Semester.program)
        ).order_by(Semester.program_id.asc(), Semester.semester_no.asc(), Semester.id.asc())
        return query.all()    
    
class CourseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_course(self, course_data: dict) -> Course:
        try:
            course = Course(**course_data)
            self.db.add(course)
            self.db.commit()
            self.db.refresh(course)
            return course

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_course(self, course_id: int) -> Course | None:
        return (
            self.db.query(Course)
            .filter(Course.id == course_id)
            .first()
        )
    
    def update_course(self, course_id: int, update_data: dict) -> Course | None:
        course = self.get_course(course_id)
        if not course:
            return None

        try:
            for key, value in update_data.items():
                if hasattr(course, key):   # 🔒 protect model
                    setattr(course, key, value)

            self.db.commit()
            self.db.refresh(course)
            return course

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete_course(self, course_id: int) -> bool:
        course = self.get_course(course_id)
        if not course:
            return False

        try:
            self.db.delete(course)
            self.db.commit()
            return True

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def list_courses(self) -> list[Course]:
        return self.db.query(Course).all()
    
# class CourseComponentRepository:
#     def __init__(self, db: Session):
#         self.db = db

#     def create_course_component(self, component_data: dict) -> CourseComponent:
#         try:
#             component = CourseComponent(**component_data)
#             self.db.add(component)
#             self.db.commit()
#             self.db.refresh(component)
#             return component

#         except IntegrityError:
#             self.db.rollback()
#             raise

#         except SQLAlchemyError:
#             self.db.rollback()
#             raise

#     def get_course_component(self, component_id: int) -> CourseComponent | None:
#         return (
#             self.db.query(CourseComponent)
#             .filter(CourseComponent.id == component_id)
#             .first()
#         )
    
#     def update_course_component(self, component_id: int, update_data: dict) -> CourseComponent | None:
#         component = self.get_course_component(component_id)
#         if not component:
#             return None

#         try:
#             for key, value in update_data.items():
#                 if hasattr(component, key):   # 🔒 protect model
#                     setattr(component, key, value)

#             self.db.commit()
#             self.db.refresh(component)
#             return component

#         except IntegrityError:
#             self.db.rollback()
#             raise

#         except SQLAlchemyError:
#             self.db.rollback()
#             raise

#     def delete_course_component(self, component_id: int) -> bool:
#         component = self.get_course_component(component_id)
#         if not component:
#             return False

#         try:
#             self.db.delete(component)
#             self.db.commit()
#             return True

#         except SQLAlchemyError:
#             self.db.rollback()
#             raise

#     def list_course_components(self) -> list[CourseComponent]:
#         return self.db.query(CourseComponent).all()


class CourseCategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_course_category(self, category_data: dict) -> CourseCategory:
        try:
            category = CourseCategory(**category_data)
            self.db.add(category)
            self.db.commit()
            self.db.refresh(category)
            return category

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def get_course_category(self, category_id: int) -> CourseCategory | None:
        return (
            self.db.query(CourseCategory)
            .filter(CourseCategory.id == category_id)
            .first()
        )

    def update_course_category(self, category_id: int, update_data: dict) -> CourseCategory | None:
        category = self.get_course_category(category_id)
        if not category:
            return None

        try:
            for key, value in update_data.items():
                if hasattr(category, key):   # 🔒 protect model
                    setattr(category, key, value)

            self.db.commit()
            self.db.refresh(category)
            return category

        except IntegrityError:
            self.db.rollback()
            raise

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete_course_category(self, category_id: int) -> bool:
        category = self.get_course_category(category_id)
        if not category:
            return False

        try:
            self.db.delete(category)
            self.db.commit()
            return True

        except SQLAlchemyError:
            self.db.rollback()
            raise

    def list_course_categories(self) -> list[CourseCategory]:
        return self.db.query(CourseCategory).all()
