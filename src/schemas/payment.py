# Add these imports if not present
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# New schema for ApplicationFee
class ApplicationFeeCreate(BaseModel):
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_amount: float = 0.0
    is_offline: bool = False
    offline_transaction_id: Optional[str] = None
    offline_payment_method: Optional[str] = None
    offline_receipt_enabled: bool = False

# Update SemesterFeeCreate to include all fee types
class SemesterFeeCreate(BaseModel):
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    payment_amount: float = 0.0
    semester: str  # e.g., '1st', '2nd'
    lab_fee: float = 0.0
    lms_fee: float = 0.0
    exam_fee: float = 0.0
    tuition_fee: float = 0.0
    total_fee: float = 0.0
    is_offline: bool = False