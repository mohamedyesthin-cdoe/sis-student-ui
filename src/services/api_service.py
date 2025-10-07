from typing import Optional
from sqlalchemy.orm import Session
from src.schemas.payment import DataResponse, PaginationResponse, StandardResponse
from src.repositories.api import ApiRepository
from datetime import datetime
from src.schemas.master import ProgrameOut, DataOut
from fastapi import HTTPException, status

class ApiService:
    def __init__(self, db: Session):
        self.repo = ApiRepository(db)
        
    def get_payment_all_students(self,limit: int,next_page: Optional[str],previous_page: Optional[str]) -> StandardResponse:
        """Retrieve paginated students with payments."""
        
        students, new_next_token, prev_token = self.repo.get_payment_all_students(
            limit=limit,
            next_page=next_page,
            previous_page=previous_page
        )

        pagination = PaginationResponse(
            previous_page=prev_token,
            next_page=new_next_token
        )   
        
        students_data = []
        #gender_map = {'12842': 'Male', '12843': 'Female'}
        for student in students:
            data = student.dict() if hasattr(student, "dict") else vars(student)
            admission_year = datetime.now().year
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