from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.core.config import settings
from contextlib import contextmanager
from src.db.base import Base
from sqlalchemy.ext.declarative import declarative_base
import os

BASE_DIR = os.path.abspath(__file__)
if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

engine = create_engine(settings.DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()