# src/services/auth_service.py
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, text
from typing import Optional
from src.repositories.user import get_group_by_id, get_student_id_by_user_id
from src.core.security.jwt import create_access_token
from src.db.session import get_db
from src.models.user import User
from src.models.staff import Staff
from src.utils.hash import verify_password
from src.utils.encryption import decrypt_password
from src.utils.logger import setup_logger
logger = setup_logger()

def authenticate_user(identifier: str, password: str, db: Session, is_encrypted: bool = True) -> User:

    try:
        raw_password = decrypt_password(password) if is_encrypted else password
    except:
        raise HTTPException(status_code=400, detail="Invalid encrypted password")

    user = (
        db.query(User)
        .outerjoin(Staff, Staff.user_id == User.id)
        .filter(
            or_(
                User.username == identifier,
                User.email == identifier,
                User.phone == identifier,
                Staff.employee_id == identifier,
            )
        )
        .first()
    )

    if not user or not verify_password(raw_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def _get_staff_id_by_user_id(db: Session, user_id: int) -> Optional[int]:
    row = db.execute(
        text(
            """
        SELECT id
        FROM staff
        WHERE user_id = :user_id
        LIMIT 1
            """
        ),
        {"user_id": user_id},
    ).first()
    if not row:
        return None
    return row[0]

def login_user(identifier: str, password: str, db: Session, is_encrypted: bool = True):
    user = authenticate_user(identifier, password, db, is_encrypted)
    group_id = get_group_by_id(db, user.id)
    student_info = get_student_id_by_user_id(db, user.id)

    # base payload
    token_payload = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "group_id": group_id,
    }

    staff_rec = None

    if student_info:
        token_payload["student_id"] = user.student_id
        if getattr(student_info, "gender", None):
            token_payload["gender"] = student_info.gender
    else:
        staff_id = _get_staff_id_by_user_id(db, user.id)
        if staff_id:
            token_payload["faculty_id"] = staff_id
        else:
            token_payload["student_id"] = user.student_id

    token = create_access_token(data=token_payload)

    if token_payload.get("faculty_id"):
        print("staff_id=%s for user.id=%s" % (token_payload["faculty_id"], user.id))
    else:
        print("no staff record found for user.id=%s" % user.id)
    return {"access_token": token, "token_type": "bearer"}
