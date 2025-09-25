from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from src.models.students import Student, Programe
from src.models.payment import Payment
from src.utils.hash import decode_token, encode_token

class ApiRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_programe_by_id(self, programe_id: int) -> Optional[str]:
        programe = self.db.query(Programe).filter(Programe.id == programe_id).first()
        return programe.programe if programe else None

    def get_payment_all_students(
        self,
        limit: int = 10,
        next_page: Optional[str] = None,
        previous_page: Optional[str] = None
    ) -> Tuple[List[Student], Optional[str], Optional[str]]:
        """Fetch paginated students with payment details."""

        query = self.db.query(Student).options(
            joinedload(Student.programe),
            joinedload(Student.address_details),
            joinedload(Student.payments).joinedload(Payment.semester_fee),
            joinedload(Student.payments).joinedload(Payment.application_fee)
        ).order_by(Student.id)

        students = []
    
        if next_page:
            last_id = decode_token(next_page)
            query = query.filter(Student.id > last_id)
            students = query.limit(limit).all()

        elif previous_page:
            last_id = decode_token(previous_page)
            query = query.filter(Student.id < last_id).order_by(Student.id.desc())
            students = query.limit(limit).all()
            students.reverse()  # maintain ascending order

        else:
            students = query.limit(limit).all()



        # Generate tokens
        new_next_token = encode_token(students[-1].id) if len(students) == limit else None
        prev_token = encode_token(students[0].id) if (next_page or previous_page) and students[0].id != self.get_first_student_id() else None

        return students, new_next_token, prev_token

    def get_first_student_id(self) -> Optional[int]:
        first = self.db.query(Student).order_by(Student.id.asc()).first()
        return first.id if first else None

    def get_program_fees(self) -> List[Programe]:
        programs = self.db.query(Programe).options(joinedload(Programe.fee)).all()
        return programs