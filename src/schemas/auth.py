from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: Optional[str] = None

class LoginSchema(BaseModel):
    username: str
    password: str
    is_encrypted: bool = True