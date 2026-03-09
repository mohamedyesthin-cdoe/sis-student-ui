from sqlalchemy import Column, Integer, String, DateTime, func
from src.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    uploaded_by = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False)

    api_key = Column(String(255), unique=True, nullable=False, index=True)

    status = Column(String(20), default="active")  # active, revoked, expired

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    expires_at = Column(DateTime(timezone=True), nullable=True)