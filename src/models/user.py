from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from src.db import Base

user_group = Table(
    "user_group", Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("group_id", ForeignKey("groups.id"), primary_key=True)
)

group_permission = Table(
    "group_permission", Base.metadata,
    Column("group_id", ForeignKey("groups.id"), primary_key=True),
    Column("permission_id", ForeignKey("permissions.id"), primary_key=True)
)

user_permission = Table(
    "user_permission", Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("permission_id", ForeignKey("permissions.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String(15), unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    reset_token = Column(String(255), nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    reset_token_used = Column(Boolean, default=False, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True, unique=True)
    #faculty_id = Column(Integer, nullable=True)

    groups = relationship("Group", secondary=user_group, back_populates="users")
    permissions = relationship("Permission", secondary=user_permission, back_populates="users")
    staff = relationship("Staff", back_populates="user", uselist=False)

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, unique=True, nullable=True)

    users = relationship("User", secondary=user_group, back_populates="groups")
    permissions = relationship("Permission", secondary=group_permission, back_populates="groups")

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True)
    codename = Column(String, unique=True)

    users = relationship("User", secondary=user_permission, back_populates="permissions")
    groups = relationship("Group", secondary=group_permission, back_populates="permissions")
