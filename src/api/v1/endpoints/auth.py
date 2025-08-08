from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from src.services.auth_service import login_user
from src.schemas.auth import Token, LoginSchema
from src.db.session import get_db

router = APIRouter()

@router.post("/login", response_model=Token)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    return login_user(data.username, data.password, db, is_encrypted=data.is_encrypted)