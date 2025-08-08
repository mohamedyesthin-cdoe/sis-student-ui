from sqlalchemy.orm import Session
from src.models.user import User, Group
from src.schemas.user import UserCreate
from src.utils.hash import hash_password
from fastapi import HTTPException

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

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
    def create_user(db:Session, user_data: UserCreate) -> User:
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
        user.groups.append(group)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_all_roles(db:Session):
        return db.query(Group).all()