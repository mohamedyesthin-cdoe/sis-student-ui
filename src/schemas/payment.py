# Add these imports if not present
from typing import List, Optional
from pydantic import BaseModel, field_validator, field_serializer
from datetime import datetime, date
from src.schemas.master import FeeSchema

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
    admno: Optional[str] = None
    sgrp: Optional[str] = None
    name: str
    gender: Optional[str] = None
    dob: Optional[date] = None
    admyr: Optional[str] = None
    admdt: Optional[date] = None
    cshort: Optional[str] = None
    #programe_name: str
    #registration_no: Optional[str] = None
    sregno: Optional[str] = None
    barcode: Optional[str] = None
    mobile_number: Optional[str] = None
    email: Optional[str] = None
    addrs1: Optional[str] = None
    addrs2: Optional[str] = None
    addrs3: Optional[str] = None
    addrs4: Optional[str] = None
    #application_fee: Optional[ApplicationFee] = None
    #semester_fee: Optional[SemesterFee] = None
    
    @field_serializer("dob")
    def format_dob(self, value: date):
        return value.strftime("%d-%m-%Y")  # This formats it when returning JSON
    
    class Config:
        from_attributes = True
        
class PaginationResponse(BaseModel):
    previous_page: Optional[str] = None
    next_page: Optional[str] = None

class DataResponse(BaseModel):
    list: List[StudentSchema]
    pagination: Optional[PaginationResponse] = None

class StandardResponse(BaseModel):
    status_code: int
    status: bool
    message: str
    data: DataResponse

class ProgramResponse(BaseModel):
    short_name: str
    admission_year: Optional[str] = None
    programe: str
    programe_code: str
    fee: Optional[List[FeeSchema]] = None

    class Config:
        from_attributes = True

class ProgramMasterResponse(BaseModel):
    cshort: str
    admyr: Optional[str] = None
    fees1: Optional[str] = None
    fees2: Optional[str] = None
    fees3: Optional[str] = None 
    fees4: Optional[str] = None
    fees5: Optional[str] = None
    fees6: Optional[str] = None
    ano: Optional[int] = None
    duration: Optional[str] = None
    feestype: Optional[str] = None
    cat: Optional[str] = None

    class Config:
        from_attributes = True

class FeesMasterResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: Optional[List[ProgramMasterResponse]] = None

class StudentFeeItem(BaseModel):
    feeshead: int
    fees_name: str
    fees: float
    orderby: int

class StudentWiseFeesResponse(BaseModel):
    barcode: str
    student_unique_id: str
    acyear: str
    fees: List[StudentFeeItem]

class AllStudentsFeesResponse(BaseModel):
    data: List[StudentWiseFeesResponse]

class StudentFeeFlat(BaseModel):
    barcode: str
    feeshead: int
    acayear: str
    fees: float
    orderby: int
    studentuniqueid: str

class StudentFeeFlatData(BaseModel):
    list: List[StudentFeeFlat]
    pagination: PaginationResponse

class StudentFeeFlatResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: Optional[StudentFeeFlatData] = None

class AccountMaster(BaseModel):
    ano: int
    ahead: Optional[str] = None
    camt: float
    damt: float
    grpcode: Optional[int] = None
    maincode: Optional[int] = None
    subcode: Optional[int] = None
    dsid: Optional[str] = None
    rpcode: Optional[str] = None
    rpname: Optional[str] = None
    fyr: Optional[str] = None

class AccountMasterResponse(BaseModel):
    code: int
    status: bool
    message: str
    data: Optional[List[AccountMaster]] = None


# ============================================
# Payment Workflow Schemas (Collexo Integration)
# ============================================

class CollexoWebhookPayload(BaseModel):
    """Webhook payload from Collexo payment gateway"""
    transaction_id: str
    student_id: int
    application_no: str
    amount: float
    status: str  # completed, failed, pending
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    metadata: Optional[dict] = None


class PaymentTransactionResponse(BaseModel):
    id: int
    student_id: int
    payment_id: Optional[int] = None
    gateway_transaction_id: str
    gateway_name: str
    amount: float
    semester: Optional[str] = None
    status: str
    webhook_received_at: Optional[datetime] = None
    payment_confirmed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class AutoPopulatePendingPaymentRequest(BaseModel):
    """Request to auto-populate pending payments for a workflow scope"""
    program_id: int
    batch: str
    admission_year: str
    semester: str


class AutoPopulatePendingPaymentResponse(BaseModel):
    message: str
    updated_count: int
    students_updated: List[dict]  # [{"id": 1, "amount": 1000, "link": "..."}, ...]


class UpdatePendingPaymentByWebhookRequest(BaseModel):
    """Mark pending payment as completed after webhook verification"""
    student_id: int
    transaction_id: str
    payment_amount: float


