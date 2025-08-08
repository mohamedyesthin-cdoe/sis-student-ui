from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func, Enum
from sqlalchemy.orm import relationship
from src.db.session import Base
from src.utils.enum import AddressType


class Country(Base):
    __tablename__ = "countries"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    name                = Column(String(100), unique=True, nullable=False, index=True)
    country_code        = Column(String(5), nullable=False)
    phone_code          = Column(String(5), nullable=False)
    
    # Relationships
    states = relationship("State", back_populates="country", cascade="all, delete-orphan")
    address_details_corr = relationship("AddressDetails", back_populates="corr_country_rel", foreign_keys="[AddressDetails.corr_country]")
    address_details_perm = relationship("AddressDetails", back_populates="perm_country_rel", foreign_keys="[AddressDetails.perm_country]")
    students_nationality = relationship("Student", back_populates="nationality_country", foreign_keys="Student.nationality")
    addresses = relationship("Address", back_populates="country")  # <-- Add this

class State(Base):
    __tablename__       = "states"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    country_id          = Column(Integer, ForeignKey("countries.id"), nullable=False)
    name                = Column(String(100), nullable=False, index=True)

    # Relationships
    country             = relationship("Country", back_populates="states")
    districts           = relationship("District", back_populates="state")
    cities              = relationship("City", back_populates="state")
    addresses             = relationship("Address", back_populates="state")

class District(Base):
    __tablename__ = "district"
    
    id = Column(Integer, primary_key=True, index=True)
    district_name = Column(String(100), nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    
    # Relationships
    state = relationship("State", back_populates="districts")
    addresses = relationship("Address", back_populates="district")

class City(Base):
    __tablename__       = "city"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    city_name           = Column(String(100), nullable=False)
    state_id            = Column(Integer, ForeignKey("states.id"), nullable=False)
    # Relationships
    state               = relationship("State", back_populates="cities")
    addresses = relationship("Address", back_populates="city")

class Address(Base):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True)
    address_line1 = Column(String(100), nullable=False)
    address_line2 = Column(String(100), nullable=True)
    country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("district.id"), nullable=False)
    city_id = Column(Integer, ForeignKey("city.id"), nullable=False)
    postal_code = Column(String(20), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    # Relationships
    country = relationship("Country", back_populates="addresses")
    state = relationship("State", back_populates="addresses")
    district = relationship("District", back_populates="addresses")
    city = relationship("City", back_populates="addresses")
    #student_addresses = relationship("StudentAddress", back_populates="address")