from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, UniqueConstraint, Enum, Date
from src.db.session import Base
from src.models.base import AuditableBase
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

class Semester(AuditableBase):
    __tablename__ = "semesters"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    program_id = Column(Integer, ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True)
    program_code = Column(String(50), nullable=True, index=True)
    semester_no = Column(Integer, nullable=False)
    semester_name = Column(String(50), nullable=False)    
    
    program = relationship("Programe", back_populates="semesters")
    courses = relationship("Course", back_populates="semester")
    exams = relationship("Exam", back_populates="semester")
    exam_registrations = relationship("StudentExamRegistration", back_populates="semester")
    semester_results = relationship("SemesterResult", back_populates="semester")
    #students = relationship("Student", back_populates="semester")

class Course(AuditableBase):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    dept_code = Column(String(30), nullable=False)
    main_code = Column(String(30), nullable=False)
    main_course = Column(String(100), nullable=False)
    course_order = Column(Integer, nullable=False)
    course_type = Column(String(50), nullable=False)
    course_code = Column(String(50), nullable=False, unique=True)
    course_title = Column(String(200), nullable=False)
    credits = Column(Integer, nullable=False)
    regulation_pattern = Column(String(50), nullable=False)

    semester = relationship("Semester", back_populates="courses")
    components = relationship("CourseComponent", back_populates="course")
    exam_timetables = relationship("ExamTimeTable", back_populates="course")
    marks_entries = relationship("MarksEntry", back_populates="course")
    student_registrations = relationship("StudentCourseRegistration", back_populates="course")
    course_results = relationship("CourseResult", back_populates="course")


class CourseComponent(AuditableBase):
    __tablename__ = "course_components"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    component_no = Column(Integer, nullable=False)
    component_type = Column(String(50), nullable=False)
    component_code = Column(String(50), nullable=False)
    component_description = Column(String(100), nullable=False)
    max_marks = Column(Integer, nullable=False)
    min_marks = Column(Integer, nullable=False)
    min_percentage = Column(Integer, nullable=False)

    exam_mark = Column(Integer, default=False)
    is_theory = Column(Boolean, default=True)
    is_practical = Column(Boolean, default=False)
    is_ia = Column(Boolean, default=False)
    is_computed = Column(Boolean, default=False)
    computed_components = Column(ARRAY(Integer), nullable=True)

    is_others = Column(Boolean, default=False)
    specify_others = Column(String(100), nullable=True)

    core_or_elective = Column(String(30), nullable=False)
    is_programme_elective = Column(Boolean, default=False)
    elective_type = Column(String(50), nullable=True)
    elective_programe_type = Column(String(50), nullable=True)

    attendence_percentage = Column(Integer, nullable=True)
    book_type = Column(String(50), nullable=True)
    mcq_time = Column(String(50), nullable=True)
    is_tpi = Column(String(30), nullable=True)
    incl_credit = Column(Boolean, default=True)
    techorder = Column(Integer, nullable=True)
    approved = Column(Boolean, default=False)
    is_maincode = Column(Boolean, default=False)

    course = relationship("Course", back_populates="components")

    exam_timetables = relationship("ExamTimeTable", back_populates="component")
    marks_entries = relationship("MarksEntry", back_populates="component")
    student_registrations = relationship("StudentCourseRegistration", back_populates="component")
    component_results = relationship("CourseResult", back_populates="component")


# class Batch(AuditableBase):
#     __tablename__ = "batches"

#     id = Column(Integer, primary_key=True)
#     program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)

#     batch_name = Column(String(50), nullable=False)
#     academic_year = Column(String(20), nullable=False)  # 2024-2025
#     regulation = Column(String(50), nullable=False)     # R2024
#     start_year = Column(Integer, nullable=False)
#     end_year = Column(Integer, nullable=False)

#     programe = relationship("Program", back_populates="batches")
class CourseCategory(AuditableBase):
    __tablename__ = "course_category"

    id = Column(Integer, primary_key=True, index=True)
    category_code = Column(String(10), unique=True, nullable=False)
    category_name = Column(String(100), nullable=False)
