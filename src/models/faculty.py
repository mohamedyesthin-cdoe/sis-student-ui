from sqlalchemy import (
    Column, String, Integer, Date,
    Boolean, DateTime, JSON, Enum, 
    ForeignKey)
from sqlalchemy.orm import relationship
from src.db.session import Base
from datetime import datetime
from src.utils.enum import ContactPreference

class Faculty(Base):
    __tablename__         = 'faculty'

    id                  = Column(Integer, primary_key=True, index=True)
    first_name          = Column(String(50), nullable=False)
    last_name           = Column(String(50), nullable=False)
    email               = Column(String(255), unique=True, nullable=False, index=True)
    phone_number        = Column(String(15), nullable=True)
    country_id          = Column(Integer, ForeignKey("countries.id"), nullable=False)
    loyalty_points      = Column(Integer, default=0, nullable=False)
    is_active           = Column(Boolean, default=True, nullable=False)
    contact_preference  = Column(Enum(ContactPreference), default=ContactPreference.NONE, nullable=False)
    date_of_birth       = Column(Date, nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    #country             = relationship("Country", back_populates="customers")
    #address           = relationship("Address", back_populates="customer", cascade="all, delete-orphan")

