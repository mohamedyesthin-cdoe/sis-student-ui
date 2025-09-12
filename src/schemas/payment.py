# Add these imports if not present
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

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

