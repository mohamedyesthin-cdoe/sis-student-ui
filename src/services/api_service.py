from typing import Optional
from sqlalchemy.orm import Session
from src.schemas.payment import DataResponse, PaginationResponse, StandardResponse
from src.schemas.api import OdlStudentResponse
from src.repositories.api import ApiRepository
from datetime import datetime
from src.schemas.master import ProgrameOut, DataOut
from fastapi import HTTPException, status
from src.utils.logger import setup_logger
from sqlalchemy.exc import SQLAlchemyError
import requests
import time
from src.core.config import settings
from datetime import datetime, date
from src.services.integrations.student_api import create_odl_student, update_odl_student

DIGICAMPUS_USERNAME = settings.DIGICAMPUS_USERNAME
DIGICAMPUS_PASSWORD = settings.DIGICAMPUS_PASSWORD
DIGICAMPUS_BASE_URL = settings.DIGICAMPUS_API_URL
logger = setup_logger()

class ApiService:
    _token_cache = {
        "token": None,
        "exp": 0
    }

    def __init__(self, db: Session):
        self.repo = ApiRepository(db)

    def _get_auth_token(self) -> str:
        """
        Fetch and cache DigiCampus auth token
        """
        if (
            self._token_cache["token"]
            and time.time() < self._token_cache["exp"]
        ):
            return self._token_cache["token"]

        url = f"{DIGICAMPUS_BASE_URL}/users/get-auth-token"
        payload = {
            "username": DIGICAMPUS_USERNAME,
            "password": DIGICAMPUS_PASSWORD
        }

        response = requests.post(url, data=payload, timeout=10)
        response.raise_for_status()

        data = response.json()["data"]

        self._token_cache["token"] = data["token"]
        self._token_cache["exp"] = data["exp"]

        return data["token"]
        
    def get_payment_all_students(
            self,limit: int,next_page: Optional[str],
            previous_page: Optional[str]) -> StandardResponse:
        """Retrieve paginated students with payments."""
        try:
            students, new_next_token, prev_token = self.repo.get_payment_all_students(
                limit=limit,
                next_page=next_page,
                previous_page=previous_page
            )
            logger.info(f"Fetched {len(students)} students | limit={limit} next={next_page} prev={previous_page}")
        
        except SQLAlchemyError as db_err:
            logger.error(f"Database error while fetching payments: {db_err}", exc_info=True)
            raise HTTPException(status_code=500, detail="Database query failed")
        except Exception as e:
            logger.error(f"Unexpected error in fetching payment list: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")

        pagination = PaginationResponse(
            previous_page=prev_token,
            next_page=new_next_token
        )   
        
        students_data = []
        admission_year = datetime.now().year

        for student in students:
            data = student.dict() if hasattr(student, "dict") else vars(student)

            try:
                sgrp = f'{admission_year}/ID-{data.get("registration_no", "")}'.strip()
                sregno = f'00{data.get("registration_no", "")}'.strip()
                fullname = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
                programe_id = data.get('program_id')
                programe_name = self.repo.get_programe_by_id(programe_id) if programe_id else None            
                payments = data.get('payments', [])
                payment_data = [
                    payment.dict() if hasattr(payment, "dict") else vars(payment)
                    for payment in payments
                ]
                
                application_fee = None
                semester_fee = None

                if len(payment_data) > 0:
                    if payment_data[0].get("payment_type") == "application_fee":
                        application_fee = payment_data[0]
                        semester_fee = payment_data[1] if len(payment_data) > 1 else None
                    elif payment_data[0].get("payment_type") == "semester_fee":
                        semester_fee = payment_data[0]
                        application_fee = payment_data[1] if len(payment_data) > 1 else None

                # application_fee = payment_data[0] if payment_data else "No payment data"
                # semester_fee = payment_data[1] if len(payment_data) > 1 else "No semester fee data"

                address = data.get('address_details')
                if address:
                    address_data = address.dict() if hasattr(address, "dict") else vars(address)
                    addrs1 = address_data.get('corr_addr1', '')
                    addrs2 = address_data.get('corr_addr2', '')
                    city = address_data.get('corr_city', '')
                    district = address_data.get('corr_district', '')
                    state = address_data.get('corr_state', '')
                    country = address_data.get('corr_country', '')
                    zip_code = address_data.get('corr_pin', '')
                    addrs3 = f"{city}, {district}, {state}, {country}".strip(', ')
                    addrs4 = zip_code

                admission_date = payment_data[0].get('payment_date') if payment_data else None 
                admission_year_range = f"{admission_date.year}-{admission_date.year + 1}" if admission_date else None
                data.update({
                    "cat": "UG",
                    "admission_no": data.get("application_no"),
                    'sgrp': sgrp,
                    "name": fullname,
                    #"gender": gender_map.get(data.get('gender', ''), 'Unknown'),
                    "admission_year": admission_year_range,
                    "admission_date": admission_date,
                    "programe_name": programe_name,
                    'sregno': sregno,
                    "addrs1": addrs1 if address else None,
                    "addrs2": addrs2 if address else None,
                    "addrs3": addrs3 if address else None,
                    "addrs4": addrs4 if address else None,
                    "application_fee": application_fee,
                    "semester_fee": semester_fee
                })

                students_data.append(data)
            
            except Exception as student_err:
                logger.error(f"Error processing student ID {data.get('id')}: {student_err}", exc_info=True)
                continue 
        
        logger.info(f"Successfully processed {len(students_data)} students")

        return StandardResponse(
            code=200,
            status=True,
            message="data fetched successfully",
            data=DataResponse(list=students_data, pagination=pagination)
        )
    
    def get_program_fees(self) -> ProgrameOut:
        """Retrieve program and associated fees."""
        try:
            programs = self.repo.get_program_fees()
            return ProgrameOut(
                code=status.HTTP_200_OK,
                status=True,
                message="Program and fees fetched successfully",
                data=DataOut(list=programs)
            )
        except Exception as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error in endpoint: {str(e)}",
            )

    def safe_dob(self, value) -> Optional[date]:
        if not value:
            return None

        if isinstance(value, date):
            return value

        if isinstance(value, datetime):
            return value.date()

        if isinstance(value, str):
            for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
                try:
                    return datetime.strptime(value, fmt).date()
                except ValueError:
                    continue

        return None

    def safe_float(self, value) -> Optional[float]:
        if value in (None, ""):
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def safe_str(self, value) -> Optional[str]:
        return str(value) if value not in (None, "") else None

    def to_digicampus_payload(self, s) -> dict:
        return {
            "application_no": s.application_no,
            "registration_no": s.registration_no,
            "programme": s.programe.programe if s.programe else None,
            "title": s.title,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "full_name": f"{s.first_name} {s.last_name}",
            "gender": s.gender,
            "dob": s.date_of_birth.isoformat() if s.date_of_birth else None,
            "blood_group": s.blood_group,
            "email": s.email,
            "mobile_number": s.mobile_number,
            "alternative_phone": s.alternative_phone,
            "marital_status": s.marital_status,
            "religion": s.religion,
            "category": s.category,
            "caste": s.caste,
            "parent_guardian_name": s.parent_guardian_name,
            "locality": s.locality,

            # Address
            "comm_address_line_1": s.address_details.corr_addr1 if s.address_details else None,
            "comm_address_line_2": s.address_details.corr_addr2 if s.address_details else None,
            "comm_city": s.address_details.corr_city if s.address_details else None,
            "comm_state": s.address_details.corr_state if s.address_details else None,
            "comm_country": s.address_details.corr_country if s.address_details else None,
            "comm_pin": s.address_details.corr_pin if s.address_details else None,

            "per_address_line_1": s.address_details.perm_addr1 if s.address_details else None,
            "per_address_line_2": s.address_details.perm_addr2 if s.address_details else None,
            "per_city": s.address_details.perm_city if s.address_details else None,
            "per_state": s.address_details.perm_state if s.address_details else None,
            "per_country": s.address_details.perm_country if s.address_details else None,
            "per_pin": s.address_details.perm_pin if s.address_details else None,

            # Academic
            "ssc_school": s.academic_details.ssc_school if s.academic_details else None,
            "ssc_scheme": s.academic_details.ssc_scheme if s.academic_details else None,
            "ssc_score": self.safe_float(s.academic_details.ssc_score)
                if s.academic_details else None,
            "ssc_year": self.safe_str(s.academic_details.ssc_year)
                if s.academic_details else None,

            "hsc_scheme": s.academic_details.hsc_scheme if s.academic_details else None,
            "hsc_score": self.safe_float(s.academic_details.hsc_score)
                if s.academic_details else None,
            "hsc_year": self.safe_str(s.academic_details.hsc_year)
                if s.academic_details else None,

            "diploma_institute": s.academic_details.diploma_institute if s.academic_details else None,
            "diploma_score": self.safe_float(s.academic_details.diploma_score)
                if s.academic_details else None,

            # DEB
            "deb_id": s.deb_details.deb_id if s.deb_details else None,
            "deb_name": s.deb_details.deb_name if s.deb_details else None,
            "deb_gender": s.deb_details.deb_gender if s.deb_details else None,
            "deb_dob": self.safe_dob(s.deb_details.deb_date_of_birth).isoformat()
                if s.deb_details and self.safe_dob(s.deb_details.deb_date_of_birth)
                else None,
            "deb_abcid": s.deb_details.deb_abcid if s.deb_details else None,
            "deb_status": s.deb_details.deb_status if s.deb_details else None,
        }
    
    async def post_student_data(self) -> list[dict]:
        students = self.repo.get_all_students()
        results = []
        token = self._get_auth_token()
        
        for s in students:
            try:
                payload = self.to_digicampus_payload(s)
                
                api_response = await create_odl_student(token, payload)
                results.append({
                    "application_no": s.application_no,
                    "status": "success",
                    "response": api_response
                })
                
                s.is_pushed_digi = True
                self.repo.db.commit()
                self.repo.db.refresh(s)
                results.append(payload)

            except Exception as e:
                logger.exception("Digicampus sync failed")
                results.append({
                    "application_no": s.application_no,
                    "status": "failed",
                    "error": str(e)
                })

        return results
    
    async def put_student_data(self) -> list[dict]:
        students = self.repo.get_updated_students()
        results = []
        token = self._get_auth_token()
        
        for s in students:
            try:
                payload = self.to_digicampus_payload(s)
                
                api_response = await update_odl_student(token, payload, s.application_no)
                results.append(payload)
                results.append({
                    "application_no": s.application_no,
                    "status": "success",
                    "response": api_response
                })
                results.append(payload)
                print("Payload prepared for PUT:", payload)

            except Exception as e:
                logger.exception("Digicampus sync failed")
                results.append({
                    "application_no": s.application_no,
                    "status": "failed",
                    "error": str(e)
                })

        return results

    def post_student_data1(self):
        students = self.repo.get_all_students()

        return [
            OdlStudentResponse(
                programme=s.programe.programe if s.programe else None,
                application_no=s.application_no,
                registration_no=s.registration_no,
                title=s.title,
                first_name=s.first_name,
                last_name=s.last_name,
                full_name=f"{s.first_name} {s.last_name}",
                gender=s.gender,
                dob=s.date_of_birth.strftime("%Y-%m-%d") if s.date_of_birth else None,
                blood_group=s.blood_group,
                email=s.email,
                mobile_number=s.mobile_number,
                alternative_phone=s.alternative_phone,
                marital_status=s.marital_status,
                religion=s.religion,
                category=s.category,
                caste=s.caste,
                parent_guardian_name=s.parent_guardian_name,
                locality=s.locality,
                
                # Address details (assuming relations)
                comm_address_line_1=s.address_details.corr_addr1 if s.address_details else None,
                comm_address_line_2=s.address_details.corr_addr2 if s.address_details else None,
                comm_city=s.address_details.corr_city if s.address_details else None,
                comm_state=s.address_details.corr_state if s.address_details else None,
                comm_country=s.address_details.corr_country if s.address_details else None,
                comm_pin=s.address_details.corr_pin if s.address_details else None,
                per_address_line_1=s.address_details.perm_addr1 if s.address_details else None,
                per_address_line_2=s.address_details.perm_addr2 if s.address_details else None,
                per_city=s.address_details.perm_city if s.address_details else None,
                per_state=s.address_details.perm_state if s.address_details else None,
                per_country=s.address_details.perm_country if s.address_details else None,
                per_pin=s.address_details.perm_pin if s.address_details else None,
                
                # Academic details (assuming relations)
                ssc_school=s.academic_details.ssc_school if s.academic_details else None,
                ssc_scheme=s.academic_details.ssc_scheme if s.academic_details else None,
                ssc_score=float(s.academic_details.ssc_score) if s.academic_details and s.academic_details.ssc_score not in (None, "") else None,
                ssc_year=str(s.academic_details.ssc_year) if s.academic_details and s.academic_details.ssc_year else None,

                hsc_scheme=s.academic_details.hsc_scheme if s.academic_details else None,
                hsc_score=float(s.academic_details.hsc_score) if s.academic_details and s.academic_details.hsc_score not in (None, "") else None,
                hsc_year=str(s.academic_details.hsc_year) if s.academic_details and s.academic_details.hsc_year else None,

                diploma_institute=s.academic_details.diploma_institute if s.academic_details else None,
                diploma_score=float(s.academic_details.diploma_score) if s.academic_details and s.academic_details.diploma_score not in (None, "") else None,
                # DEB details
                debid=s.deb_details.deb_id if s.deb_details else None,
                deb_name=s.deb_details.deb_name if s.deb_details else None,
                deb_gender=s.deb_details.deb_gender if s.deb_details else None,
                deb_dob=self.safe_dob(s.deb_details.deb_date_of_birth) if s.deb_details else None,   
                deb_abcid=s.deb_details.deb_abcid if s.deb_details else None,
                deb_status=s.deb_details.deb_status if s.deb_details else None,
            )
            for s in students
        ]
