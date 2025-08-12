from pydantic import BaseModel, EmailStr, validator, constr
from datetime import date, datetime
from typing import Optional
from src.utils.enum import (
    HonorificType, GenderEnum, BloodGroupEnum, 
    MaritalStatus, CategoryEnum, Religion
)

class AddressBase(BaseModel):
    corr_addr1: str
    corr_addr2: Optional[str] = None
    corr_city: str
    corr_state: str
    corr_district: str
    corr_country: int
    corr_pin: str
    corr_addr_same: bool = True
    perm_addr1: Optional[str] = None
    perm_addr2: Optional[str] = None
    perm_city: Optional[str] = None
    perm_state: Optional[str] = None
    perm_district: Optional[str] = None
    perm_country: int
    perm_pin: Optional[str] = None
    
class AcademicDetailsBase(BaseModel):
    ssc_board_id: Optional[int] = None
    ssc_school: str 
    ssc_scheme: str
    ssc_score: str
    ssc_year: date
    after_ssc: str
    hsc_board_id: Optional[int] = None
    hsc_school: str
    hsc_result: str
    hsc_scheme: str
    hsc_score: str
    hsc_year: date
    diploma_institute: str
    diploma_board: str
    diploma_result: str
    diploma_scheme: str
    diploma_score: str
    diploma_year: date

class DocumentDetailsBase(BaseModel):
    class_10th_marksheet: Optional[str] = None
    class_12th_marksheet: Optional[str] = None
    graduation_marksheet: Optional[str] = None
    diploma_marksheet: Optional[str] = None
    work_experience_certificates: Optional[str] = None
    passport: Optional[str] = None
    aadhar: Optional[str] = None
    signature: Optional[str] = None

class DeclarationDetailsBase(BaseModel):
    declaration_agreed: bool
    applicant_name: str
    parent_name: Optional[str] = None
    declaration_date: date
    place: str

class DebDetailsBase(BaseModel):
    deb_id: str
    deb_name: Optional[str] = None
    deb_gender: Optional[str] = None
    deb_date_of_birth: Optional[str] = None
    deb_university: Optional[str] = None
    deb_program: Optional[str] = None
    deb_abcid: Optional[str] = None
    deb_details_1: Optional[str] = None
    deb_details_2: Optional[str] = None
    deb_details_3: Optional[str] = None
    deb_details_4: Optional[str] = None
    deb_details_5: Optional[str] = None
    deb_details_6: Optional[str] = None
    deb_details_7: Optional[str] = None
    deb_details_8: Optional[str] = None
    deb_details_9: Optional[str] = None
    deb_details_10: Optional[str] = None
    deb_details_11: Optional[str] = None
    deb_details_12: Optional[str] = None
    deb_details_13: Optional[str] = None
    deb_details_14: Optional[str] = None
    deb_details_15: Optional[str] = None
    deb_status: Optional[str] = None

class StudentBase(BaseModel):
    program_id: int
    application_no: Optional[int] = None
    registration_no: str
    title: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    blood_group: str
    email: EmailStr
    mobile_number: str
    alternative_phone: Optional[str] = None
    whatsapp_number: str
    marital_status: str
    religion: str
    nationality: int
    category: str
    caste: Optional[str] = None
    aadhaar_number: str
    pan_number: str
    parent_guardian_name: str
    relationship_with_student: str
    current_employment: Optional[str] = None
    annual_income: Optional[int] = None
    locality: Optional[str] = None
    passport_issued_country: Optional[str] = None
    passport_number: Optional[str] = None
    passport_expiry_date: Optional[str] = None
    is_deleted: bool = False
    address_details: AddressBase
    academic_details: AcademicDetailsBase
    document_details: DocumentDetailsBase
    declaration_details: DeclarationDetailsBase
    deb_details: DebDetailsBase

    @validator("mobile_number")
    def validate_mobile_number(cls, v):
        if not v or not v.isdigit() or len(v) > 15:
            raise ValueError("Mobile number must be digits only and at most 15 characters long")
        return v

    @validator("aadhaar_number")
    def validate_aadhaar(cls, v):
        if not (v.isdigit() and len(v) == 12):
            raise ValueError("Aadhaar number must be exactly 12 digits")
        return v

    @validator("pan_number")
    def validate_pan(cls, v):
        if not (len(v) == 10 and v[:5].isalpha() and v[5:9].isdigit() and v[9].isalpha()):
            raise ValueError("PAN number must be 5 letters, 4 digits, and 1 letter (total 10 characters)")
        return v
    
class StudentCreate(StudentBase):
    """Schema for creating a new student."""
    pass

class AddressDetailsResponse(AddressBase):
    """Schema for Address Details Response."""
    id: int

class AcademicDetailsResponse(AcademicDetailsBase):
    """Schema for Academic Details Response."""
    id: int

class DocumentDetailsResponse(DocumentDetailsBase):
    """Schema for Document Details Response."""
    id: int 

class DeclarationDetailsResponse(DeclarationDetailsBase):
    """Schema for Declaration Details Response."""
    id: int

class DebDetailsResponse(DebDetailsBase):
    """Schema for Deb Details Response."""
    id: int 

class StudentResponse(BaseModel):
    id: int
    program_id: int
    registration_no: Optional[str] = None
    application_no: Optional[int]
    title: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    blood_group: str
    email: str
    mobile_number: str
    alternative_phone: Optional[str]
    whatsapp_number: str
    marital_status: str
    religion: str
    nationality: int
    category: str
    caste: Optional[str]
    aadhaar_number: Optional[str]
    pan_number: Optional[str]
    parent_guardian_name: str
    relationship_with_student: str
    current_employment: Optional[str]
    annual_income: Optional[str]
    locality: Optional[str]
    passport_issued_country: Optional[int]
    passport_number: Optional[str]
    passport_expiry_date: Optional[date]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    address_details: Optional[AddressDetailsResponse]
    academic_details: Optional[AcademicDetailsResponse]
    document_details: Optional[DocumentDetailsResponse]
    declaration_details: Optional[DeclarationDetailsResponse]
    deb_details: Optional[DebDetailsResponse]

    class Config:
        from_attributes = True

class SyncResponse(BaseModel):
    message: str
    total_sync_count: int