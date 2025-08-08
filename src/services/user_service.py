from src.schemas.user import UserCreate
from src.utils.hash import hash_password
from src.models.user import User, Group
from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.repositories.user import UserRepository

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate):
        return UserRepository.create_user(self.db, user_data)
    
    def list_groups(self):
        return UserRepository.get_all_roles(self.db)
    