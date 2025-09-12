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
    
    async with httpx.AsyncClient(timeout=10.0) as client:
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
    print("deb_id", deb_id)
    deb_api_url = f"{settings.UGC_DEB_API_URL}/GetStudentDetails"
    headers = {
        "APIKey": settings.UGC_API_GET_KEY,
        "ClientID": settings.CLIENT_ID_GET,
        "Content-Type": "application/json",
    }
    print(f"Fetching DEB student details...{headers}")
    params={"DEBuniqueID": deb_id}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(
                deb_api_url,
                params=params,
                headers=headers,
            )
            print(response)
            response.raise_for_status()
            data = response.json()
            print(f"DEB student details fetched...{data}")
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
            ).filter_by(is_pushed='False').all()
    
    print(len(students))
    print(students)

    if not students:
        raise HTTPException(status_code=404, detail="No students to push")
                
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            for student in students:
                #programe = db.query(Programe).filter(Programe.id == student.program_id).first()
                admission_date = db.query(Payment).filter(Payment.student_id == student.id and Payment.semester_fee=='semester_fee').first()
                nationality = db.query(Country).filter(Country.id == student.nationality).first()
                if nationality.name == 'India':
                    CountryResidence = 'India'
                else:
                    CountryResidence = 'Others'
                
                params={
                    "DEBuniqueID": student.deb_details.deb_id,
                    "UniversityName": UNIVERSITY_NAME,
                    "CourseName": student.programe.programe,
                    "AdmissionDate": admission_date.payment_date.strftime("%Y-%m-%d"),
                    "AdmissionDetails": ADMISSION_DETAILS,
                    "EnrollmentNumber": student.registration_no,
                    "ModeOfEducation": MODE_EDUCATION,
                    "Category": student.category,
                    "GovernmentIdentifier": GovernmentIdentifier,
                    "Locality": student.locality,
                    "Nationality": nationality.name,
                    "GovernmentIdentifierNumber": student.aadhaar_number,
                    "CountryResidence": CountryResidence,
                }

                print(f"Fetching DEB student details...{params}")
                response = await client.post(
                    deb_api_url,
                    headers=headers,
                    params=params,
                )

                print(response)
                response.raise_for_status()
                data = response.json()
                print(f"DEB student details fetched...{data}")
                # Validate response format
                student.is_pushed = 'True'
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