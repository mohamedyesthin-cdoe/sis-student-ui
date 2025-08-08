# models/menu.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.db.session import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    icon = Column(String, nullable=True)
    to = Column(String, nullable=True)

    submenus = relationship("SubMenu", back_populates="menu", cascade="all, delete-orphan")

class SubMenu(Base):
    __tablename__ = "submenus"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menus.id"))
    name = Column(String, nullable=False)
    to = Column(String, nullable=True)

    menu = relationship("Menu", back_populates="submenus")