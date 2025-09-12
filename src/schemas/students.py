from datetime import date, datetime
from typing import Optional, List, Union
from pydantic import BaseModel, EmailStr, validator

from src.utils.enum import (
    HonorificType, GenderEnum, BloodGroupEnum, 
    MaritalStatus, CategoryEnum, Religion
)
from src.schemas.payment import PaymentResponse

# -----------------------------
# Address Schemas
# -----------------------------
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

class AddressUpdate(BaseModel):
    corr_addr1: Optional[str] = None
    corr_addr2: Optional[str] = None
    corr_city: Optional[str] = None
    corr_state: Optional[str] = None
    corr_district: Optional[str] = None
    corr_country: Optional[int] = None
    corr_pin: Optional[str] = None
    corr_addr_same: Optional[bool] = None
    perm_addr1: Optional[str] = None
    perm_addr2: Optional[str] = None
    perm_city: Optional[str] = None
    perm_state: Optional[str] = None
    perm_district: Optional[str] = None
    perm_country: Optional[int] = None
    perm_pin: Optional[str] = None

class AddressDetailsResponse(AddressBase):
    id: int

# -----------------------------
# Academic Details Schemas
# -----------------------------
class AcademicDetailsBase(BaseModel):
    ssc_board_id: Optional[int] = None
    ssc_school: str 
    ssc_scheme: str
    ssc_score: str
    ssc_year: Optional[date] = None
    after_ssc: str
    hsc_board_id: Optional[int] = None
    hsc_school: str
    hsc_result: str
    hsc_scheme: str
    hsc_score: str
    hsc_year: Optional[date] = None
    diploma_institute: str
    diploma_board: str
    diploma_result: str
    diploma_scheme: str
    diploma_score: str
    diploma_year: Optional[date] = None

class AcademicDetailsUpdate(BaseModel):
    ssc_board_id: Optional[int] = None
    ssc_school: Optional[str] = None
    ssc_scheme: Optional[str] = None
    ssc_score: Optional[str] = None
    ssc_year: Optional[date] = None
    after_ssc: Optional[str] = None
    hsc_board_id: Optional[int] = None
    hsc_school: Optional[str] = None
    hsc_result: Optional[str] = None
    hsc_scheme: Optional[str] = None
    hsc_score: Optional[str] = None
    hsc_year: Optional[date] = None
    diploma_institute: Optional[str] = None
    diploma_board: Optional[str] = None
    diploma_result: Optional[str] = None
    diploma_scheme: Optional[str] = None
    diploma_score: Optional[str] = None
    diploma_year: Optional[date] = None

class AcademicDetailsResponse(AcademicDetailsBase):
    id: int

# -----------------------------
# Document Details Schemas
# -----------------------------
class DocumentDetailsBase(BaseModel):
    class_10th_marksheet: Optional[str] = None
    class_12th_marksheet: Optional[str] = None
    graduation_marksheet: Optional[str] = None
    diploma_marksheet: Optional[str] = None
    work_experience_certificates: Optional[str] = None
    passport: Optional[str] = None
    aadhar: Optional[str] = None
    signature: Optional[str] = None

class DocumentDetailsUpdate(BaseModel):
    class_10th_marksheet: Optional[str] = None
    class_12th_marksheet: Optional[str] = None
    graduation_marksheet: Optional[str] = None
    diploma_marksheet: Optional[str] = None
    work_experience_certificates: Optional[str] = None
    passport: Optional[str] = None
    aadhar: Optional[str] = None
    signature: Optional[str] = None

class DocumentDetailsResponse(DocumentDetailsBase):
    id: int

# -----------------------------
# Declaration Details Schemas
# -----------------------------
class DeclarationDetailsBase(BaseModel):
    declaration_agreed: bool
    applicant_name: str
    parent_name: Optional[str] = None
    declaration_date: date
    place: str

class DeclarationDetailsUpdate(BaseModel):
    declaration_agreed: Optional[bool] = None
    applicant_name: Optional[str] = None
    parent_name: Optional[str] = None
    declaration_date: Optional[date] = None
    place: Optional[str] = None

class DeclarationDetailsResponse(DeclarationDetailsBase):
    id: int

# -----------------------------
# DEB Details Schemas
# -----------------------------
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

class DebDetailsUpdate(BaseModel):
    deb_id: Optional[str] = None
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

class DebDetailsResponse(DebDetailsBase):
    id: int

# -----------------------------
# Student Schemas
# -----------------------------
class StudentBase(BaseModel):
    program_id: int
    application_no: Optional[str] = None
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
    annual_income: Optional[str] = None
    locality: Optional[str] = None
    passport_issued_country: Optional[str] = None
    passport_number: Optional[str] = None
    passport_expiry_date: Optional[str] = None
    is_deleted: bool = False

    # Nested
    address_details: AddressBase
    academic_details: AcademicDetailsBase
    document_details: DocumentDetailsBase
    declaration_details: DeclarationDetailsBase
    deb_details: DebDetailsBase
    payment_details: Optional[List[PaymentResponse]] = []

    # ------------------
    # Validators
    # ------------------
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

class StudentUpdate(BaseModel):
    program_id: Optional[int] = None
    application_no: Optional[str] = None
    registration_no: Optional[str] = None
    title: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    alternative_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    marital_status: Optional[str] = None
    religion: Optional[str] = None
    nationality: Optional[int] = None
    category: Optional[str] = None
    caste: Optional[str] = None
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    parent_guardian_name: Optional[str] = None
    relationship_with_student: Optional[str] = None
    current_employment: Optional[str] = None
    annual_income: Optional[str] = None
    locality: Optional[str] = None
    passport_issued_country: Optional[str] = None
    passport_number: Optional[str] = None
    passport_expiry_date: Optional[str] = None
    is_deleted: Optional[bool] = None

    # Nested Updates
    address_details: Optional[AddressUpdate] = None
    academic_details: Optional[AcademicDetailsUpdate] = None
    document_details: Optional[DocumentDetailsUpdate] = None
    declaration_details: Optional[DeclarationDetailsUpdate] = None
    deb_details: Optional[DebDetailsUpdate] = None    

class StudentResponse(BaseModel):
    id: int
    program_id: int
    registration_no: Optional[str] = None
    application_no: Optional[str]
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

    # Nested Responses
    address_details: Optional[AddressDetailsResponse]
    academic_details: Optional[AcademicDetailsResponse]
    document_details: Optional[DocumentDetailsResponse]
    declaration_details: Optional[DeclarationDetailsResponse]
    deb_details: Optional[DebDetailsResponse]
    payments: Optional[List[PaymentResponse]] = []

    class Config:
        from_attributes = True

# -----------------------------
# Sync + DEB API Schemas
# -----------------------------
class SyncResponse(BaseModel):
    message: str
    total_sync_count: int

class DebStudentResponse(BaseModel):
    StudentID: Optional[str] = None
    Program: Optional[str] = None
    email: Optional[str] = None
    stdname: Optional[str] = None
    fathername: Optional[str] = None
    mobile: Optional[str] = None
    cdate: Optional[str] = None
    institutename: Optional[str] = None
    InstituteID: Optional[str] = None
    ipaddress: Optional[str] = None
    programcode: Optional[str] = None
    mode: Optional[str] = None
    AdmissionDate: Optional[str] = None
    AdmissionDetails: Optional[str] = None
    UniversityName: Optional[str] = None
    CourseName: Optional[str] = None
    ABCID: Optional[str] = None
    DEBUniqueID: Optional[str] = None
    Gender: Optional[str] = None
    DOB: Optional[str] = None
    EnrollmentNumber: Optional[str] = None
    UniqueNumber: Optional[str] = None
    Document: Optional[str] = None
    Category: Optional[str] = None
    GovernmentIdentifier: Optional[str] = None
    GovernmentIdentifierNumber: Optional[str] = None
    Nationality: Optional[str] = None
    CountryResidence: Optional[str] = None
    Locality: Optional[str] = None
    BulkDEBIDData: Optional[str] = None
    ModeEducation: Optional[str] = None
    Year: Optional[str] = None
    session: Optional[str] = None
    _list: Optional[str] = None

class DebResponse(BaseModel):
    Message: str
    Status: str
    Resource: Union[List[DebStudentResponse], str, None] = None

class DebPushResponse(BaseModel):
    Message: str
    Status: str