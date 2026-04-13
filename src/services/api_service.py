from typing import Optional
from sqlalchemy.orm import Session
from src.schemas.payment import DataResponse, PaginationResponse, StandardResponse
from src.schemas.api import OdlStudentResponse, LeadCreate
from src.repositories.api import ApiRepository
from src.repositories.master import MasterRepository
from datetime import datetime
from src.schemas.master import ProgrameOut, DataOut, ProgramListResponse
from src.schemas.payment import *
from fastapi import HTTPException, status
from src.utils.logger import setup_logger
from sqlalchemy.exc import SQLAlchemyError
import requests
import time
from src.core.config import settings
from datetime import datetime, date
from src.services.integrations.student_api import create_odl_student, update_odl_student, add_lead
from collections import defaultdict
from src.models.students import Programe

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
        self.master_repo = MasterRepository(db)

    def _get_auth_token(self) -> str:
        """
        Fetch and cache DigiCampus auth token
        """
        try:
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

            # Log status + body for diagnosis
            logger.debug("Digicampus token response status=%s body=%s", response.status_code, response.text)

            try:
                response.raise_for_status()
            except requests.HTTPError:
                # include response.text in error so we can see provider message
                logger.error("Digicampus token request failed: %s", response.text)
                raise HTTPException(status_code=502, detail=f"Digicampus auth failed: {response.status_code} {response.text}")

            # parse JSON (if any)
            try:
                resp_json = response.json()
            except ValueError:
                logger.error("Digicampus token response is not JSON: %s", response.text)
                raise HTTPException(status_code=502, detail=f"Invalid token response from DigiCampus (non-JSON): {response.text}")

            # try common token shapes and fall back to logging full JSON
            token = None
            exp = 0

            if isinstance(resp_json, dict):
                data = resp_json.get("data") or resp_json.get("result") or {}
                if isinstance(data, dict) and data.get("token"):
                    token = data.get("token"); exp = data.get("exp", 0)
                token = token or resp_json.get("token") or resp_json.get("access_token")

            if not token:
                # log full JSON and return it as detail for debugging (temporary)
                logger.error("Invalid token response from DigiCampus JSON: %s", resp_json)
                raise HTTPException(status_code=502, detail=f"Invalid token response from DigiCampus JSON: {resp_json}")

            self._token_cache["token"] = token
            self._token_cache["exp"] = exp or 0

            return token
        except requests.RequestException as e:
            logger.exception("Failed to fetch DigiCampus auth token: %s", e)
            raise HTTPException(status_code=502, detail=f"Digicampus auth failed: {e}")
    
    def fees_master(self) -> FeesMasterResponse:
        try:
            fee_details = self.repo.get_program_fees()
            fee_data = []

            for fee in fee_details:
                data = fee.dict() if hasattr(fee, "dict") else vars(fee)

                # Prepare 3 fee type containers
                fee_type_map = {
                    30101: {"ano": 30101, "label": "application_fee"},
                    30102: {"ano": 30102, "label": "admission_fee"},
                    30100: {"ano": 30100, "label": "tuition_fee"},
                    30103: {"ano": 30103, "label": "exam_fee"},
                    30104: {"ano": 30104, "label": "lms_fee"},
                    30105: {"ano": 30105, "label": "lab_fee"},
                }

                # Initialize structure for each fee type
                result_rows = {}

                for ano, config in fee_type_map.items():
                    result_rows[ano] = {
                        "cshort": data["short_name"],
                        "admyr": data["admission_year"],
                        "fees1": None,
                        "fees2": None,
                        "fees3": None,
                        "fees4": None,
                        "fees5": None,
                        "fees6": None,
                        "ano": ano,
                        "duration": data["duration"],
                        "feestype": "Indian",
                        "cat": data["category"]
                    }

                # Loop semester fees
                for fee_item in data.get("fee", []):
                    semester_name = fee_item.semester  # "Semester 1"
                    if semester_name:
                        sem_no = semester_name.split()[-1]
                        key = f"fees{sem_no}"

                        for ano, config in fee_type_map.items():
                            field_name = config["label"]
                            result_rows[ano][key] = getattr(fee_item, field_name)

                # Append all 3 rows
                fee_data.extend(result_rows.values())

            return {
                "code": 200,
                "status": True,
                "message": "Fees master fetched successfully",
                "data": fee_data
            }

        except SQLAlchemyError as db_err:
            logger.error(f"Database error while fetching payments: {db_err}", exc_info=True)
            raise HTTPException(status_code=500, detail="Database query failed")

        except Exception as e:
            logger.error(f"Unexpected error in fetching payment list: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")
        
    def course_master(self) -> ProgramListResponse:
        try:
            course = self.master_repo.get_program()
            course_data = []
            for value in course:
                data = value.dict() if hasattr(value, "dict") else vars(value)
                dic = {
                    "cat": data['category'],
                    "splty": 'NA',
                    "div": "NA",
                    "code": data['programe_code'],
                    "des": data["programe"],
                    "cshort": data["short_name"],
                    "duration": data["duration"],
                    "faculty": data["faculty"]
                }
                course_data.append(dic)
            return {
                "code": 200,
                "status": True,
                "message": "Fees master fetched successfully",
                "data": course_data
            }
        except SQLAlchemyError as db_err:
            logger.error(f"Database error while fetching payments: {db_err}", exc_info=True)
            raise HTTPException(status_code=500, detail="Database query failed")
        except Exception as e:
            logger.error(f"Unexpected error in fetching payment list: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")

    def all_student_account_list(
            self,limit: int,next_page: Optional[str],
            previous_page: Optional[str]) -> StandardResponse:
        """Retrieve paginated students with payments."""
        try:
            students, new_next_token, prev_token = self.repo.all_student_account_list(
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

        for student in students:
            data = student.dict() if hasattr(student, "dict") else vars(student)

            try:
                reg_no = data.get("registration_no", "")
                admission_year = data.get('admission_year', '')
                sgrp = f'{admission_year}/ID-{reg_no}'.strip()
                sregno = f'00{reg_no}'.strip()
                fullname = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
                programe_id = data.get('program_id')
                programe_name = self.repo.get_programe_by_id(programe_id) if programe_id else None   
                payments = data.get('payments', [])
                payment_data = [
                    payment.dict() if hasattr(payment, "dict") else vars(payment)
                    for payment in payments
                ]
                admyr = admission_year
                application_fee = None
                semester_fee = None
                dob_value = data.get("date_of_birth")

                # Convert only if it's string in DD-MM-YYYY format
                if isinstance(dob_value, str):
                    dob_value = datetime.strptime(dob_value, "%Y-%m-%d").date()

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
                    "admyr": admyr,
                    "admdt": admission_date,
                    "admno": data.get("application_no"),
                    'sgrp': sgrp,
                    "name": fullname,
                    #"gender": gender_map.get(data.get('gender', ''), 'Unknown'),
                    "dob": dob_value,
                    "admission_year": admission_year_range,
                    "admission_date": admission_date,
                    "cshort": programe_name.short_name,
                    'sregno': sregno,
                    'barcode': reg_no,
                    "addrs1": addrs1 if address else None,
                    "addrs2": addrs2 if address else None,
                    "addrs3": addrs3 if address else None,
                    "addrs4": addrs4 if address else None,
                    #"application_fee": application_fee,
                    #"semester_fee": semester_fee
                })

                students_data.append(data)
            
            except Exception as student_err:
                logger.error(f"Error processing student ID {data.get('id')}: {student_err}", exc_info=True)
                continue 
        
        logger.info(f"Successfully processed {len(students_data)} students")

        return StandardResponse(
            status_code=200,
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
            "mobile_no": s.mobile_number,
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

                # validate required fields before sending
                required = ["programme", "registration_no", "first_name", "full_name", "gender", "dob", "blood_group", "email", "mobile_no"]
                missing = [k for k in required if not payload.get(k)]
                if missing:
                    logger.warning("Skipping push for %s — missing required fields: %s. Payload: %s", s.application_no, missing, payload)
                    results.append({
                        "application_no": s.application_no,
                        "status": "failed",
                        "response": {
                            "status_code": 400,
                            "status": "error",
                            "message": "Missing required fields for DigiCampus",
                            "errors": {k: {"_required": "This field is required"} for k in missing}
                        }
                    })
                    continue

                logger.debug("Digicampus -> sending payload for application_no=%s: %s", s.application_no, payload)

                api_response = await create_odl_student(token, payload)

                logger.debug("Digicampus <- response for application_no=%s: %s", s.application_no, api_response)

                status_code = None
                if isinstance(api_response, dict):
                    status_code = api_response.get("status_code") or api_response.get("code") or None

                if status_code and int(status_code) >= 400:
                    results.append({
                        "application_no": s.application_no,
                        "status": "failed",
                        "response": api_response
                    })
                else:
                    results.append({
                        "application_no": s.application_no,
                        "status": "success",
                        "response": api_response
                    })
                    s.is_pushed_digi = True
                    self.repo.db.commit()
                    self.repo.db.refresh(s)

            except Exception as e:
                logger.exception("Digicampus sync failed for application_no=%s: %s", s.application_no, e)
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
                api_response = await update_odl_student(token, payload, s.registration_no)
                results.append({
                    "application_no": s.application_no,
                    "status": "success",
                    "response": api_response
                })
                s.last_updated = datetime.utcnow()
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

    async def add_lead(self, data: LeadCreate) -> dict:
        try:
            payload = data.model_dump(exclude_none=True)
            api_response = await add_lead(payload)
            #lead = await add_lead(data)
            return {
                "code": 201,
                "status": True,
                "message": "Lead added successfully",
            }
        except Exception as e:
            logger.error(f"Error adding lead: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Failed to add lead")
        
    # def get_all_students_fees(self):

    #     app_fees = self.repo.get_application_fees()
    #     sem_fees = self.repo.get_semester_fees()
    #     account_heads_list = self.repo.get_all_account_heads()

    #     # Convert account heads into dictionary
    #     account_heads = {ah.anodes: ah for ah in account_heads_list}

    #     grouped = defaultdict(list)

    #     # ✅ Application Fees
    #     for r in app_fees:
    #         grouped[r.barcode].append({
    #             "feeshead": r.feeshead,
    #             "fees_name": r.fees_name,
    #             "fees": r.fees,
    #             "orderby": r.orderby
    #         })

    #     # ✅ Semester Fee Breakdown
    #     for r in sem_fees:

    #         breakdown = {
    #             "Tuition fees": r.tuition_fee,
    #             "Lab fees": r.lab_fee,
    #             "LMS fees": r.lms_fee,
    #             "Exam fees": r.exam_fee,
    #             "Admission fees": r.admission_fee
    #         }

    #         for name, amount in breakdown.items():
    #             if amount and amount > 0:
    #                 ah = account_heads.get(name)
    #                 if ah:
    #                     grouped[r.barcode].append({
    #                         "feeshead": ah.ano,
    #                         "fees_name": ah.anodes,
    #                         "fees": amount,
    #                         "orderby": ah.id
    #                     })

    #     # Final response
    #     response = []

    #     for barcode, fees in grouped.items():
    #         response.append({
    #             "barcode": barcode,
    #             "fees": sorted(fees, key=lambda x: x["orderby"])
    #         })

    #     return response

    # def get_all_students_fees(self) -> StudentFeeFlatResponse:
    #     students = self.repo.get_fees()
    #     program = self.repo.db.query(Programe).first()
    #     admyr = program.admission_year if program else None

    #     result: list[StudentFeeFlat] = []

    #     for student in students:
    #         barcode = student.registration_no

    #         application_amount = 0.0
    #         lab_fee = 0.0
    #         exam_fee = 0.0
    #         admission_fee = 0.0
    #         lms_fee = 0.0
    #         tuition_fee = 0.0

    #         for payment in student.payments:

    #             if payment.payment_type == "application_fee":
    #                 application_amount += payment.payment_amount or 0

    #             elif payment.payment_type == "semester_fee" and payment.semester_fee:
    #                 lab_fee += payment.semester_fee.lab_fee or 0
    #                 exam_fee += payment.semester_fee.exam_fee or 0
    #                 admission_fee += payment.semester_fee.admission_fee or 0
    #                 lms_fee += payment.semester_fee.lms_fee or 0
    #                 tuition_fee += payment.semester_fee.tuition_fee or 0

    #         fees_map = [
    #             (30101, application_amount, 1),
    #             (30102, admission_fee, 2),
    #             (30100, tuition_fee, 3),
    #             (30103, lms_fee, 4),
    #             (30104, exam_fee, 5),
    #             (30105, lab_fee, 6),
    #         ]

    #         for head, amount, orderby in fees_map:
    #             if amount > 0:
    #                 result.append(
    #                     StudentFeeFlat(
    #                         barcode=str(barcode),
    #                         acayear=admyr,
    #                         feeshead=int(head),
    #                         fees=float(amount),
    #                         orderby=int(orderby),
    #                         studentuniqueid=str(barcode)
    #                     )
    #                 )

    #     return StudentFeeFlatResponse(
    #         code=200,
    #         status=True,
    #         message="Student fees fetched successfully",
    #         data=result if result else []
    #     )

    def get_all_students_fees(
        self,
        limit: int,
        next_page: Optional[str],
        previous_page: Optional[str]
    ) -> StudentFeeFlatResponse:

        students, new_next_token, prev_token = self.repo.get_fees(
            limit=limit,
            next_page=next_page,
            previous_page=previous_page
        )

        program = self.repo.db.query(Programe).first()
        admyr = program.admission_year if program else None

        result: list[StudentFeeFlat] = []

        for student in students:
            barcode = student.registration_no

            application_amount = 0.0
            lab_fee = 0.0
            exam_fee = 0.0
            admission_fee = 0.0
            lms_fee = 0.0
            tuition_fee = 0.0

            for payment in student.payments:

                if payment.payment_type == "application_fee":
                    application_amount += payment.payment_amount or 0

                elif payment.payment_type == "semester_fee" and payment.semester_fee:
                    lab_fee += payment.semester_fee.lab_fee or 0
                    exam_fee += payment.semester_fee.exam_fee or 0
                    admission_fee += payment.semester_fee.admission_fee or 0
                    lms_fee += payment.semester_fee.lms_fee or 0
                    tuition_fee += payment.semester_fee.tuition_fee or 0

            fees_map = [
                (30101, application_amount, 1),
                (30102, admission_fee, 2),
                (30100, tuition_fee, 3),
                (30103, lms_fee, 4),
                (30104, exam_fee, 5),
                (30105, lab_fee, 6),
            ]

            for head, amount, orderby in fees_map:
                if amount > 0:
                    result.append(
                        StudentFeeFlat(
                            barcode=str(barcode),
                            acayear=admyr,
                            feeshead=int(head),
                            fees=float(amount),
                            orderby=int(orderby),
                            studentuniqueid=str(barcode)
                        )
                    )

        pagination = PaginationResponse(
            previous_page=prev_token,
            next_page=new_next_token
        )

        return StudentFeeFlatResponse(
            code=200,
            status=True,
            message="Student fees fetched successfully",
            data={
                "list": result,
                "pagination": pagination
            }
        )
    
    def get_account_master(self):
        data = self.repo.get_account_master()
        return AccountMasterResponse(
                code=200,
                status=True,
                message="Account master fetched successfully",
                data=data
            )
        
                        