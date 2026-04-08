from src.schemas.user import UserCreate
from src.utils.hash import hash_password
from src.models.user import User, Group
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.repositories.user import UserRepository
from src.core.security.jwt import create_reset_token
from src.utils.email import send_reset_email
import asyncio
from datetime import datetime, timedelta


class UserService:

    def __init__(self, db: Session):
        self.db = db
        self.repo = UserRepository()

    def create_user(self, user_data: UserCreate):
        return UserRepository.create_user(self.db, user_data)

    def list_groups(self):
        return UserRepository.get_all_roles(self.db)

    def bulk_create_users(self, users_data, group_id: int):
        return UserRepository.bulk_create_users(
            self.db,
            users_data,
            group_id
        )

    # -----------------------------
    # FORGOT PASSWORD
    # -----------------------------
    def forgot_password(self, email: str):

        user = self.repo.get_user_by_email(
            self.db,
            email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Generate token
        token = create_reset_token(user.email)

        # Set expiry (24 hours)
        expiry = datetime.utcnow() + timedelta(hours=24)

        # Save token details
        user.reset_token = token
        user.reset_token_expiry = expiry
        user.reset_token_used = False

        self.db.commit()

        # Build reset link
        reset_link = (
            "https://sis.sriramachandradigilearn.edu.in/reset-password"
            f"?token={token}"
        )

        # Send email
        asyncio.run(
            send_reset_email(
                user.email,
                reset_link
            )
        )

        return {
            "message": "Password reset link sent to your email"
        }

    # -----------------------------
    # RESET PASSWORD
    # -----------------------------
    def reset_password(
        self,
        token: str,
        new_password: str
    ):
        token = token.strip()

        user = (
            self.db.query(User)
            .filter(User.reset_token == token)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset link"
            )

        # Check if already used
        if user.reset_token_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This reset link has already been used"
            )

        # Check expiry
        if user.reset_token_expiry < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset link expired"
            )

        # Update password
        user.hashed_password = hash_password(
            new_password
        )

        # Invalidate token immediately
        user.reset_token_used = True

        self.db.commit()

        return {
            "message": "Password reset successfully"
        }
