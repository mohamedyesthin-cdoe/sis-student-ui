from datetime import datetime
from src.db.session import Base
from sqlalchemy import Column, Integer, DateTime

class AuditableBase(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    