from passlib.context import CryptContext
import hashlib
from src.core.security.jwt import SECRET_KEY
import base64
from fastapi import HTTPException
import os
from cryptography.fernet import Fernet

SECRET_KEY = os.getenv("SECRET_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

key = base64.urlsafe_b64encode(hashlib.sha256(SECRET_KEY.encode()).digest())
fernet = Fernet(key)

def encode_token(student_id: int) -> str:
    """Encrypt student_id into a secure token"""
    return fernet.encrypt(str(student_id).encode()).decode()

def decode_token(token: str) -> int:
    """Decrypt token back into student_id"""
    return int(fernet.decrypt(token.encode()).decode())