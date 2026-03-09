from typing import List, Optional, Tuple
from sqlalchemy import null
from sqlalchemy.orm import Session, joinedload
from src.models.students import Student, Programe
from src.models.payment import Payment, SemesterFee
from src.models.finance import AccountHead
from src.utils.hash import decode_token, encode_token

class ApiRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_programe_by_id(self, programe_id: int) -> Optional[str]:
        programe = self.db.query(Programe).filter(Programe.id == programe_id).first()
        return programe if programe else None

    def all_student_account_list(
        self,
        limit: int = 100,
        next_page: Optional[str] = None,
        previous_page: Optional[str] = None
    ) -> Tuple[List[Student], Optional[str], Optional[str]]:
        """Fetch paginated students with payment details."""
        program = self.db.query(Programe).first()
        admission_year = program.admission_year if program else None
        query = self.db.query(Student).options(
            joinedload(Student.programe),
            joinedload(Student.address_details),
            joinedload(Student.payments).joinedload(Payment.semester_fee),
            joinedload(Student.payments).joinedload(Payment.application_fee)
        ).filter(Student.admission_year == admission_year).order_by(Student.id)

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
        programs = self.db.query(Programe).options(joinedload(Programe.fee)).order_by(Programe.id.asc()).all()
        return programs
    
    def get_all_students(self) -> List[Student]:
        students = self.db.query(Student).options(
            joinedload(Student.programe),
            joinedload(Student.address_details),
            joinedload(Student.academic_details),
            joinedload(Student.deb_details)
        ).order_by(Student.id.asc()).filter(Student.is_pushed_digi == False).all()
        return students
    
    def get_updated_students(self) -> List[Student]:
        students = (
            self.db.query(Student)
            .options(
                joinedload(Student.programe),
                joinedload(Student.address_details),
                joinedload(Student.academic_details),
                joinedload(Student.deb_details),
            )
            .filter(Student.updated_at > Student.last_updated)
            .order_by(Student.id.asc())
            .all()
        )
        return students
    
    # def get_fees(self):
    #     return (
    #         self.db.query(Student)
    #         .options(
    #             joinedload(Student.payments)
    #                 .joinedload(Payment.application_fee),
    #             joinedload(Student.payments)
    #                 .joinedload(Payment.semester_fee),
    #         ).order_by(Student.id.asc())
    #         .all()
    #     )

    def get_fees(
        self,
        limit: int = 100,
        next_page: Optional[str] = None,
        previous_page: Optional[str] = None
    ):

        program = self.db.query(Programe).first()
        admission_year = program.admission_year if program else None
        query = (
            self.db.query(Student)
            .options(
                joinedload(Student.payments)
                    .joinedload(Payment.application_fee),
                joinedload(Student.payments)
                    .joinedload(Payment.semester_fee),
            ).filter(Student.admission_year == admission_year)
            .order_by(Student.id.asc())
        )

        students = []

        if next_page:
            last_id = decode_token(next_page)
            query = query.filter(Student.id > last_id)
            students = query.limit(limit).all()

        elif previous_page:
            last_id = decode_token(previous_page)
            query = query.filter(Student.id < last_id).order_by(Student.id.desc())
            students = query.limit(limit).all()
            students.reverse()

        else:
            students = query.limit(limit).all()

        # ---------- Pagination Tokens ----------
        new_next_token = None
        prev_token = None

        if students:
            # next page exists only if limit reached
            if len(students) == limit:
                new_next_token = encode_token(students[-1].id)

            # previous page only if we came from next page OR not first page
            if next_page or previous_page:
                prev_token = encode_token(students[0].id)

        return students, new_next_token, prev_token
    
    def get_application_fees(self):
        return (
            self.db.query(
                Student.registration_no.label("barcode"),
                AccountHead.ano.label("feeshead"),
                AccountHead.anodes.label("fees_name"),
                Payment.payment_amount.label("fees"),
                AccountHead.id.label("orderby")
            )
            .join(Payment, Payment.student_id == Student.id)
            .join(AccountHead, AccountHead.anodes == "Application fees")
            .filter(Payment.payment_type == "application_fee")
            .all()
        )
    
    def get_semester_fees(self):
        return (
            self.db.query(
                Student.registration_no.label("barcode"),
                SemesterFee.semester.label("semester"),
                SemesterFee.tuition_fee.label("tuition_fee"),
                SemesterFee.lab_fee.label("lab_fee"),
                SemesterFee.lms_fee.label("lms_fee"),
                SemesterFee.exam_fee.label("exam_fee"),
                SemesterFee.admission_fee.label("admission_fee")
            )
            .join(Payment, Payment.student_id == Student.id)
            .join(SemesterFee, SemesterFee.payment_id == Payment.id)
            .filter(Payment.payment_type == "semester_fee")
            .all()
        )
    
    def get_all_account_heads(self):
        return self.db.query(AccountHead).all()
    
    def get_account_master(self):
        totals = {
            30101: {"ahead": "Application Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
            30102: {"ahead": "Admission Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
            30100: {"ahead": "Tuition Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
            30104: {"ahead": "LMS Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
            30103: {"ahead": "Exam Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
            30105: {"ahead": "Lab Fees", "camt": 0, "damt": 0, "grpcode": 3, "maincode": 1, "subcode": 1, "dsid": "s", "rpcode": None, "rpname": None},
        }

        students = self.db.query(Student).all()
        fyr = self.db.query(Programe).first()

        for k in totals:
            totals[k]["fyr"] = fyr.admission_year if fyr else None

        for student in students:
            for payment in student.payments:

                # Application Fee
                if payment.payment_type == "application_fee":
                    totals[30101]["camt"] += payment.payment_amount or 0

                # Semester Fee
                elif payment.payment_type == "semester_fee" and payment.semester_fee:
                    sf = payment.semester_fee

                    totals[30102]["camt"] += sf.admission_fee or 0
                    totals[30100]["camt"] += sf.tuition_fee or 0
                    totals[30104]["camt"] += sf.lms_fee or 0
                    totals[30103]["camt"] += sf.exam_fee or 0
                    totals[30105]["camt"] += sf.lab_fee or 0

        return [
            {
                "ano": ano,
                **data
            }
            for ano, data in totals.items()
        ]