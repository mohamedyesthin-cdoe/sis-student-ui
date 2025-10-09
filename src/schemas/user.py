from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr
    phone: str

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

class BulkUserCreateRequest(BaseModel):
    group_id: int
    users: List[BulkUserCreate]

