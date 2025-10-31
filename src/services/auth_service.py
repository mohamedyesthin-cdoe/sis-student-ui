# src/services/auth_service.py
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from src.repositories.user import get_group_by_id, get_student_id_by_user_id
from src.core.security.jwt import create_access_token
from src.db.session import get_db
from src.models.user import User
from src.utils.hash import verify_password
from src.utils.encryption import decrypt_password

def authenticate_user(username: str, password: str, db: Session, is_encrypted: bool = True) -> User:

    try:
        raw_password = decrypt_password(password) if is_encrypted else password
    except:
        raise HTTPException(status_code=400, detail="Invalid encrypted password")

    user = db.query(User).filter(User.username == username).first()

    if not user or not verify_password(raw_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user

def login_user(username: str, password: str, db: Session, is_encrypted: bool = True):
    user = authenticate_user(username, password, db, is_encrypted)
    group_id = get_group_by_id(db, user.id)
    student_info = get_student_id_by_user_id(db, user.id)
    if student_info:
        token = create_access_token(data={"id": user.id,"username": user.username, "email": user.email, "student_id": user.student_id, "group_id": group_id, "gender": student_info.gender})
    token = create_access_token(data={"id": user.id,"username": user.username, "email": user.email, "student_id": user.student_id, "group_id": group_id})
    return {"access_token": token, "token_type": "bearer"}