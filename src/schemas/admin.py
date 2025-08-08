from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Annotated

class GroupCreate(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=30)]

class GroupUpdate(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=30)]

class GroupOut(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }