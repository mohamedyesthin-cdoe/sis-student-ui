from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class OdlStudentResponse(BaseModel):
    programme: Optional[str] = None
    application_no: Optional[str] = None
    registration_no: str
    title: str
    first_name: str
    last_name: str
    full_name: str
    gender: str
    dob: Optional[str] = None
    blood_group: Optional[str] = None
    email: str
    mobile_number: str
    alternative_phone: Optional[str] = None
    marital_status: str
    religion: str
    category: str
    caste: Optional[str] = None
    parent_guardian_name: str
    locality: str

    comm_address_line_1: Optional[str] = None
    comm_address_line_2: Optional[str] = None
    comm_city: Optional[str] = None
    comm_state: Optional[str] = None
    comm_country: Optional[str] = None
    comm_pin: Optional[str] = None
    per_address_line_1: Optional[str] = None
    per_address_line_2: Optional[str] = None
    per_city: Optional[str] = None
    per_state: Optional[str] = None
    per_country: Optional[str] = None
    per_pin: Optional[str] = None

    ssc_school: Optional[str] = None
    ssc_scheme: Optional[str] = None
    ssc_score: Optional[float] = None
    ssc_year: Optional[str] = None

    hsc_scheme: Optional[str] = None
    hsc_score: Optional[float] = None
    hsc_year: Optional[str] = None

    diploma_institute: Optional[str] = None
    diploma_score: Optional[float] = None

    debid: Optional[str] = None
    deb_name: Optional[str] = None
    deb_gender: Optional[str] = None
    deb_dob: Optional[date] = None
    deb_abcid: Optional[str] = None
    deb_status: Optional[str] = None

    class Config:
        from_attributes = True
