from pydantic import BaseModel, EmailStr, StringConstraints, validator, Field
from typing import Optional, List, Annotated
from datetime import date, datetime
import re
from enum import Enum
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

class CityResponse(BaseModel):
    id: int
    city_name: str
    state_id: int

    class Config:
        from_attributes = True

class AddressCreate(BaseModel):
    street: Annotated[str, Field(min_length=2, max_length=100)]
    city: Annotated[str, Field(min_length=2, max_length=50)]
    zip_code: Annotated[str, Field(min_length=2, max_length=10)]
    country_id: int
    state_id: int
    is_default: bool = False

class AddressResponse(BaseModel):
    id: int
    customer_id: int
    country: CountryResponse
    state: StateResponse
    street: str
    city: str
    zip_code: str
    is_default: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True