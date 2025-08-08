from pydantic import BaseModel, EmailStr, StringConstraints, validator, Field
from typing import Optional, List, Annotated
from datetime import date, datetime
import re
from enum import Enum
from src.schemas.address import AddressCreate, AddressResponse
from src.utils.enum import ContactPreference
from typing_extensions import Annotated

class CountryCreate(BaseModel):
    name: str
    country_code: str

class CountryResponse(BaseModel):
    id: int
    name: str
    country_code: str

    class Config:
        from_attributes = True

class StateCreate(BaseModel):
    name: str
    country_id: int

class StateResponse(BaseModel):
    id: int
    country_id: int
    name: str

    class Config:
        from_attributes = True

class FacultyCreate(BaseModel):
    first_name: Annotated[str, Field(min_length=2, max_length=50)]
    last_name: Annotated[str, Field(min_length=2, max_length=50)]
    email: EmailStr
    phone_number: Optional[Annotated[str, Field(min_length=7, max_length=15)]] = None    
    country_id: int
    date_of_birth: Optional[date] = None
    contact_preference: ContactPreference = ContactPreference.NONE
    address: Optional[List[AddressCreate]] = None

    @validator("first_name", "last_name")
    def validate_name(cls, value: str) -> str:
        if not re.match(r"^[a-zA-Z\s]+$", value):
            raise ValueError("Name must contain only letters and spaces")
        return value

    # @validator("date_of_birth")
    # def validate_age(cls, value: Optional[date]) -> Optional[date]:
    #     if value:
    #         today = date.today()
    #         age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    #         if age < 18:
    #             raise ValueError("Faculty must be at least 18 years old")
    #     return value

    @validator("phone_number")
    def validate_phone_number(cls, value: Optional[str]) -> Optional[str]:
        if value and value.startswith("+"):
            raise ValueError("Phone number should not include country code; it will be prepended based on country")
        return value

class FacultyResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str]
    #country: CountryResponse
    loyalty_points: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    contact_preference: ContactPreference
    date_of_birth: Optional[date]
    address: List[AddressResponse]

    class Config:
        from_attributes = True