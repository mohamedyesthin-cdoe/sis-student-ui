from pydantic import BaseModel, EmailStr
from typing import Optional

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


