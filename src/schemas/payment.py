# Add these imports if not present
from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import datetime, date

# New schema for ApplicationFee
class SemesterFeeResponse(BaseModel):
    id: int
    payment_id: int
    semester: str
    lab_fee: float
    lms_fee: float
    exam_fee: float
    tuition_fee: float
    total_fee: float

    class Config:
        from_attributes = True

class ApplicationFeeResponse(BaseModel):
    id: int
    payment_id: int

    class Config:
        from_attributes = True

class PaymentResponse(BaseModel):
    id: int
    student_id: int
    payment_type: str 
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_amount: float = 0.0
    is_offline: bool = False
    offline_transaction_id: Optional[str] = None
    offline_payment_method: Optional[str] = None
    offline_receipt_enabled: bool = False
    application_fee: Optional[ApplicationFeeResponse] = None
    semester_fee: Optional[SemesterFeeResponse] = None

    class Config:
        from_attributes = True

class ApplicationFee(BaseModel):
    student_id: int
    payment_type: str 
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_amount: float = 0.0
    is_offline: bool = False
    offline_transaction_id: Optional[str] = None
    offline_payment_method: Optional[str] = None
    offline_receipt_enabled: bool = False

    class Config:
        from_attributes = True

class SemesterFee(BaseModel):
    student_id: int
    payment_type: str 
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_amount: float = 0.0
    is_offline: bool = False
    offline_transaction_id: Optional[str] = None
    offline_payment_method: Optional[str] = None
    offline_receipt_enabled: bool = False
    semester_fee: Optional[SemesterFeeResponse] = None

    class Config:
        from_attributes = True
    
class StudentSchema(BaseModel):
    id: int
    cat: str
    admission_no: Optional[str] = None
    sgrp: Optional[str] = None
    name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    admission_year: Optional[str] = None
    admission_date: Optional[date] = None
    programe_name: str
    registration_no: Optional[str] = None
    sregno: Optional[str] = None
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    addrs1: Optional[str] = None
    addrs2: Optional[str] = None
    addrs3: Optional[str] = None
    addrs4: Optional[str] = None
    application_fee: Optional[ApplicationFee] = None
    semester_fee: Optional[SemesterFee] = None

    class Config:
        from_attributes = True
        
class PaginationResponse(BaseModel):
    previous_page: Optional[str] = None
    next_page: Optional[str] = None

class DataResponse(BaseModel):
    list: List[StudentSchema]
    pagination: Optional[PaginationResponse] = None

class StandardResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: DataResponse