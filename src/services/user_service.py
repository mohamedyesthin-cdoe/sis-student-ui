from src.schemas.user import UserCreate
from src.utils.hash import hash_password
from src.models.user import User, Group
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.user import UserRepository
from src.core.security.jwt import create_reset_token, verify_reset_token
from src.utils.email import send_reset_email
import asyncio

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository()

    def create_user(self, user_data: UserCreate):
        return UserRepository.create_user(self.db, user_data)
    
    def list_groups(self):
        return UserRepository.get_all_roles(self.db)
    
    def bulk_create_users(self, users_data, group_id: int):
        return UserRepository.bulk_create_users(self.db, users_data, group_id)
    
    def forgot_password(self, email: str):

        user = self.repo.get_user_by_email(self.db, email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        token = create_reset_token(user.email)

        reset_link = (
            f"https://sis.sriramachandradigilearn.edu.in/reset-password"
            f"?token={token}"
        )

        asyncio.run(
            send_reset_email(
                user.email,
                reset_link
            )
        )

        return {
            "message": "Password reset link sent to your email"
        }

    def reset_password(self, token: str, new_password: str):

        email = verify_reset_token(token)

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired token"
            )

        self.repo.update_password_by_email(
            self.db,
            email,
            new_password
        )

        return {
            "message": "Password reset successfully"
        }