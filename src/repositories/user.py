from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.user import User, Group, user_group
from src.models.students import Student
from src.schemas.user import UserCreate
from src.utils.hash import hash_password, generate_password
from fastapi import HTTPException, status
from src.utils.email import send_credentials_email
import asyncio
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_group_by_id(db: Session, user_id: int):
    stmt = select(user_group.c.group_id).where(user_group.c.user_id == user_id)
    result = db.execute(stmt).scalars().first()
    return result

def get_student_id_by_user_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    student = user.student_id
    result = db.query(Student).filter(Student.id == student).first()
    return result if result else None

class UserRepository:
    """
    Repository class for user-related database operations.
    Methods
    -------
    create_user(db: Session, user_data: UserCreate) -> User
        Creates a new user with the provided data and associates the user with a group.
        Raises HTTPException if the specified group does not exist.
    get_all_roles(db: Session)
        Retrieves all available groups (roles) from the database.
    """
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        try:
            group = db.query(Group).filter(Group.id == user_data.group_id).first()
            if not group:
                raise HTTPException(status_code=404, detail="Group not found")
            
            hashed_password = hash_password(user_data.password)

            user = User(
                username=user_data.username,
                first_name=user_data.first_name,
                last_name=user_data.last_name,
                email=user_data.email,
                phone=user_data.phone,
                hashed_password=hashed_password
            )
            # db.flush()
            # db.add(user)
            user.groups.append(group)
            db.add(user)
            db.commit()
            db.refresh(user)
            return user
        
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error while creating user: {str(e)}",
            )
    
    @staticmethod
    def get_all_roles(db: Session):
        try:
            result = db.query(Group).all()
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    def bulk_create_users(db: Session, users_data: list, group_id: int):
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        created_users = []
        skipped_users = []

        for data in users_data:
            # Check duplicates
            if (
                db.query(User).filter(User.email == data.email).first() or
                db.query(User).filter(User.username == data.username).first() or
                db.query(User).filter(User.phone == data.phone).first()
            ):
                skipped_users.append(data.email)
                continue

            # Generate random password
            plain_password = generate_password()
            hashed_password = hash_password(plain_password)
            fullname = f"{data.first_name} {data.last_name}"
            user = User(
                username=data.username,
                first_name=data.first_name,
                last_name=data.last_name,
                email=data.email,
                phone=data.phone,
                student_id=data.student_id,
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=False
            )

            # Assign to group → will insert into user_group
            user.groups.append(group)

            db.add(user)
            
            asyncio.run(
                send_credentials_email(data.email, data.username, plain_password, fullname)
            )
            created_users.append({"user": user, "password": plain_password})
        db.commit()

        # Refresh to get IDs
        for entry in created_users:
            db.refresh(entry["user"])

        return {
            "created_count": len(created_users),
            "skipped_count": len(skipped_users),
            "skipped_emails": skipped_users,
            "generated_credentials": [
                {
                    "username": entry["user"].username,
                    "email": entry["user"].email,
                    "password": entry["password"]
                } for entry in created_users
            ]
        }

    def get_user_by_username(self, db: Session, username: str) -> User:
        result = db.query(User).filter(User.username == username).first()
        return result
    
    def get_user_by_email(self, db: Session, email: str) -> User:
        result = db.query(User).filter(User.email == email).first()
        return result
    
    def get_user_by_mobile(self, db: Session, phone: str) -> User:
        result = db.query(User).filter(User.phone == phone).first()
        return result
    
    def get_user_by_identifier(
        self, db: Session, username: str, email: str, phone: str
    ):
        return (
            db.query(User)
            .filter(
                or_(
                    User.username == username,
                    User.email == email,
                    User.phone == phone
                )
            )
            .first()
        )