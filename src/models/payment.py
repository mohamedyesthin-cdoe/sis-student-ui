from sqlalchemy import (
    CheckConstraint, Column, DateTime, String, Integer, Enum, Date,
    ForeignKey, Index, func, Boolean, Text, Float
)
from src.db.session import Base
from src.models.address import Country
from sqlalchemy.orm import relationship
from src.models.base import AuditableBase
from datetime import datetime
from src.models.master import Programe

class Payment(AuditableBase):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    payment_type = Column(String(50))  # 'application_fee', 'semester_fee', etc.
    order_id = Column(String(50))
    transaction_id = Column(String(50))
    payment_date = Column(DateTime, default=datetime.utcnow)
    payment_amount = Column(Float, default=0.0)
    is_offline = Column(Boolean, default=False)
    offline_transaction_id = Column(String(50))
    offline_payment_method = Column(String(50))
    offline_receipt_enabled = Column(Boolean, default=False)

    student = relationship("Student", back_populates="payments")
    semester_fee = relationship("SemesterFee", back_populates="payment", uselist=False)
    application_fee = relationship("ApplicationFee", back_populates="payment", uselist=False)


class SemesterFee(Base):
    __tablename__ = "semester_fees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), unique=True)
    semester = Column(String(20), default="1st")
    admission_fee = Column(Float, default=0.0)
    lab_fee = Column(Float, default=0.0)
    lms_fee = Column(Float, default=0.0)
    exam_fee = Column(Float, default=0.0)
    tuition_fee = Column(Float, default=0.0)
    total_fee = Column(Float, default=0.0)

    payment = relationship("Payment", back_populates="semester_fee")


class ApplicationFee(Base):
    __tablename__ = "application_fees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False, unique=True)

    payment = relationship("Payment", back_populates="application_fee")


class PaymentTransaction(AuditableBase):
    """Tracks payment gateway webhook events (Collexo, etc.)"""
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=True)  # Links to Payment after confirmation
    gateway_transaction_id = Column(String(100), nullable=False, unique=True, index=True)  # Collexo transaction ID
    gateway_name = Column(String(50), default="collexo")  # Payment gateway name
    amount = Column(Float, nullable=False)
    semester = Column(String(20), nullable=True)  # Which semester this payment is for
    status = Column(String(50))  # pending, completed, failed, webhook_received, payment_created
    gateway_response = Column(Text, nullable=True)  # Full webhook response from Collexo
    webhook_received_at = Column(DateTime, nullable=True)
    payment_confirmed_at = Column(DateTime, nullable=True)
    
    student = relationship("Student", foreign_keys=[student_id])
    payment = relationship("Payment", foreign_keys=[payment_id])
