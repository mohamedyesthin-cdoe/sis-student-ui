from pydantic import BaseModel
from typing import Optional, List

class SubMenuOut(BaseModel):
    id: int
    name: str
    to: Optional[str]

    class Config:
        from_attributes = True

class MenuOut(BaseModel):
    id: int
    name: str
    icon: Optional[str]
    to: Optional[str]
    children: List[SubMenuOut] = []

    class Config:
        from_attributes = True

class MenuCreate(BaseModel):
    name: str
    icon: Optional[str]
    to: Optional[str]

class SubMenuCreate(BaseModel):
    name: str
    to: Optional[str]
    menu_id: int
