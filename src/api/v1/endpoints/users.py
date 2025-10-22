from typing import List
from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from src.core.security.dependencies import require_superuser
from src.core.security.jwt import get_current_user
from src.schemas.user import (
    UserCreate, UserOut, BulkUserCreateRequest, 
    ForgotPasswordRequest, ChangePasswordRequest
)
from src.services.user_service import UserService
from src.db.session import get_db
from src.models.user import User
from sqlalchemy.exc import IntegrityError
from src.core.security.jwt import create_reset_token
from src.utils.email import send_reset_email
from src.utils.hash import verify_password, hash_password
import asyncio

router = APIRouter()

@router.post("/add", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = UserService(db)
        return service.create_user(data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create user: {str(e)}"
        )
    except Exception as e:
        #logger.error(f"Unexpected error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
    
@router.post("/bulk-add", status_code=status.HTTP_201_CREATED)
def bulk_create_users(
    request: BulkUserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_superuser)
):
    """
    Bulk create users and assign to a group.
    Generates passwords automatically.
    """
    try:
        service = UserService(db)
        return service.bulk_create_users(request.users, request.group_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to bulk create users: {str(e)}"
        )
    
@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_reset_token(user.email)
    reset_link = f"https://sis.sriramachandradigilearn.edu.in/reset-password?token={token}"
    asyncio.run(send_reset_email(user.email, reset_link))
    return {"message": "Password reset link sent to your email"}

@router.post('/change-password')
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):  
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.hashed_password = hash_password(request.new_password)
    db.commit()
    db.refresh(current_user)
    message = {"message": "Password changed successfully"}
    return message
    

