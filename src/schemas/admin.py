from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Annotated, List
from datetime import datetime

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

class GroupResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: GroupOut

class GroupListResponse(BaseModel):
    message: str
    code: int
    status: bool
    data: List[GroupOut]

class DocumentCreate(BaseModel):
    filename: str
    uploaded_by: str | None = None

class DocumentOut(BaseModel):
    id: int
    filename: str
    file_url: str
    uploaded_by: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
