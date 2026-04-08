from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    phone: str

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value):
        if value is None:
            raise ValueError("phone is required")
        return str(value).strip()

class UserCreate(UserBase):
    password: str
    group_id: int

class UserOut(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    model_config = {
        "from_attributes": True
    }

class BulkUserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    student_id: Optional[int]

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value):
        if value is None:
            raise ValueError("phone is required")
        return str(value).strip()

class BulkUserCreateRequest(BaseModel):
    group_id: int
    users: List[BulkUserCreate]

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    #confirm_password: str
