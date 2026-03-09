from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from src.db.base import Base


# =========================================================
# Account Group
# =========================================================
class AccountGroup(Base):
    __tablename__ = "account_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    grpcode = Column(Integer, unique=True, nullable=False, index=True)
    grpname = Column(String(150), nullable=False)

    main_groups = relationship("MainGroup", back_populates="account_group")


# =========================================================
# Main Group
# =========================================================
class MainGroup(Base):
    __tablename__ = "main_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)

    maincode = Column(Integer, nullable=False, index=True)
    mainname = Column(String(150), nullable=False)

    account_group_id = Column(
        Integer,
        ForeignKey("account_groups.id", ondelete="CASCADE"),
        nullable=False
    )

    account_group = relationship("AccountGroup", back_populates="main_groups")
    sub_groups = relationship("SubGroup", back_populates="main_group")


# =========================================================
# Sub Group
# =========================================================
class SubGroup(Base):
    __tablename__ = "sub_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)

    subcode = Column(Integer, nullable=False, index=True)
    subname = Column(String(150), nullable=False)
    schedule = Column(String(100))

    main_group_id = Column(
        Integer,
        ForeignKey("main_groups.id", ondelete="CASCADE"),
        nullable=False
    )

    main_group = relationship("MainGroup", back_populates="sub_groups")
    account_heads = relationship("AccountHead", back_populates="sub_group")


# =========================================================
# Account Head
# =========================================================
class AccountHead(Base):
    __tablename__ = "account_heads"

    id = Column(Integer, primary_key=True, autoincrement=True)

    ano = Column(Integer, unique=True, nullable=False, index=True)
    anodes = Column(String(255), nullable=False)

    grpcode = Column(Integer, nullable=False)
    maincode = Column(Integer, nullable=False)

    sub_group_id = Column(
        Integer,
        ForeignKey("sub_groups.id", ondelete="CASCADE"),
        nullable=False
    )

    sub_group = relationship("SubGroup", back_populates="account_heads")
    account_masters = relationship("AccountMaster", back_populates="account_head")


# =========================================================
# Account Master
# =========================================================
class AccountMaster(Base):
    __tablename__ = "account_master"

    id = Column(Integer, primary_key=True, autoincrement=True)

    damt = Column(Float, default=0)
    camt = Column(Float, default=0)

    fyr = Column(String(20))
    dsid = Column(String(10))

    rpcode = Column(String(50))
    rpname = Column(String(150))

    account_head_id = Column(
        Integer,
        ForeignKey("account_heads.id", ondelete="CASCADE"),
        nullable=False
    )

    account_head = relationship("AccountHead", back_populates="account_masters")