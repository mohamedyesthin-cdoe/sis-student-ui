from datetime import datetime
import json
from typing import List
import httpx
from src.core.config import settings
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from src.models.students import Student
from src.models.payment import Payment
from src.models.master import Programe
from src.models.address import Country
from src.utils.logger import setup_logger

logger = setup_logger()
    
async def fetch_students_list() -> dict:
    """Fetch students from the external API."""
    api_url = settings.MERRITO_API_URL
    headers = {
        "secret-key": settings.MERRITO_SECRET_KEY,
        "access-key": settings.MERRITO_ACCESS_KEY,
        "Content-Type": "application/json",
    }
    try:
        with open("payload.json", "r") as file:
            payload = json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Payload file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding payload JSON")
    
    async with httpx.AsyncClient(timeout=100.0) as client:
        try:
            response = await client.post(api_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            # Validate response format
            # if not isinstance(data, list):
            #     raise HTTPException(status_code=500, detail="Invalid response format: Expected a list")
            return data
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="External API request failed")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)}")
        
async def get_deb_student_details(deb_id: str) -> dict:
    """Fetch DEB student details from the external API."""
    deb_api_url = f"{settings.UGC_DEB_API_URL}/GetStudentDetails"
    headers = {
        "APIKey": settings.UGC_API_GET_KEY,
        "ClientID": settings.CLIENT_ID_GET,
        "Content-Type": "application/json",
    }
    params={"DEBuniqueID": deb_id}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(
                deb_api_url,
                params=params,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
            # Validate response format
            return data
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="External API request failed")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)}")

async def push_deb_student_details(db: Session) -> dict:
    """Fetch DEB student details from the external API."""
    deb_api_url = f"{settings.UGC_DEB_API_URL}/GetAdmissionDetails"
    UNIVERSITY_NAME = "U-0478"
    MODE_EDUCATION = "Online(OL)"
    ADMISSION_DETAILS = "NA"
    GovernmentIdentifier = 'AADHAR Card'
    headers = {
        "APIKey": settings.UGC_API_POST_KEY,
        "ClientID": settings.CLIENT_ID_POST,
        "Content-Type": "application/json",
    }

    students = db.query(Student).options(
                joinedload(Student.address_details),
                joinedload(Student.academic_details),
                joinedload(Student.document_details),
                joinedload(Student.declaration_details),
                joinedload(Student.deb_details),
                joinedload(Student.payments)
            ).filter_by(is_pushed=False).all()
    #Course = 'BACHELOR OF SCIENCE (HONS) (DATA SCIENCE)'

    if not students:
        raise HTTPException(status_code=404, detail="No students to push")
                
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            for student in students:
                admission_date = db.query(Payment).filter(
                    Payment.student_id == student.id and
                    Payment.semester_fee=='semester_fee'
                ).first()
                nationality = db.query(Country).filter(Country.id == student.nationality).first()
                course = db.query(Programe).filter(Programe.id == student.program_id).first()
                if not admission_date:
                    continue
                if not nationality:
                    continue

                CountryResidence = 'Indian' if nationality.name == 'India' else 'Others'
                Locality = 'Urban' if student.locality == '1500102' else 'Rural' 
                Category = 'General' if student.category == '1500033' else (
                           'OBC' if student.category == '1500034' else (
                           'SC' if student.category == '1500035' else 'General'))

                params={
                    "DEBuniqueID": student.deb_details.deb_id,
                    "UniversityName": UNIVERSITY_NAME,
                    "CourseName": course.programe,
                    "AdmissionDate": admission_date.payment_date.strftime("%d-%m-%Y"),
                    "AdmissionDetails": ADMISSION_DETAILS,
                    "EnrollmentNumber": student.registration_no,
                    "ModeEducation": MODE_EDUCATION,
                    "Category": Category,
                    "GovernmentIdentifier": GovernmentIdentifier,
                    "Locality": Locality,
                    "Nationality": CountryResidence,
                    "GovernmentIdentifierNumber": student.aadhaar_number,
                    "CountryResidence": nationality.name,
                }

                response = await client.post(
                    deb_api_url,
                    headers=headers,
                    params=params,
                )

                response.raise_for_status()
                data = response.json()
                #Validate response format
                student.is_pushed  = True
                student.updated_at = datetime.utcnow()
                db.add(student)
                db.commit()
                db.refresh(student)
            return data
        
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="External API request failed")
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"JSON decode error: {str(e)}")
        
from typing import Dict, Any

async def create_odl_student(token: str, student_data: Dict[str, Any]) -> Dict[str, Any]:
    url = "https://digicampus.sriramachandra.edu.in/api/api-external/save-ext-stu"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "multipart/form-data",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            url,
            headers=headers,
            data=student_data,
        )

        response.raise_for_status()
        return response.json()

async def create_odl_student(token: str, student_data: Dict[str, Any]) -> Dict[str, Any]:
    url = "https://digicampus.sriramachandra.edu.in/api/api-external/save-ext-stu"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "multipart/form-data",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            url,
            headers=headers,
            data=student_data,
        )

        response.raise_for_status()
        return response.json()

async def update_odl_student(token: str, student_data: Dict[str, Any], registration_no: str) -> Dict[str, Any]:
    url = f"https://digicampus.sriramachandra.edu.in/api/api-external/edit-ext-stu/{registration_no}"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "multipart/form-data",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            url,
            headers=headers,
            data=student_data,
        )

        response.raise_for_status()
        return response.json()
    
async def add_lead(lead_data: Dict) -> Dict:
    url = "https://api.in6.nopaperforms.com/dataporting/6719/widget"

    # headers = {
    #     "Authorization": f"Bearer {token}",
    #     "Content-Type": "multipart/form-data",
    # }

    headers = {
        "secret-key": "549d101c45e64ba280481d7477919769",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            url,
            headers=headers,
            data=lead_data,
        )

        response.raise_for_status()
        return response.json()