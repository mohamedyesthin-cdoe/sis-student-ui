from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: Optional[str] = None

class LoginSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    identifier: str = Field(..., alias="username")
    password: str
    is_encrypted: bool = True
