from fastapi import APIRouter, Depends, HTTPException,status
from src.services.menu import MenuService
from src.schemas.menu import SubMenuOut, MenuOut, MenuCreate, SubMenuCreate
from src.db.session import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.post("/menu/add", response_model=MenuOut)
def create_menu(menu: MenuCreate, db: Session = Depends(get_db)):
    service = MenuService(db)
    return service.create_menu(menu.dict())

@router.post("/submenu/add", response_model=SubMenuOut)
def create_submenu(menu: SubMenuCreate, db: Session = Depends(get_db)):
    service = MenuService(db)
    return service.create_submenu(menu.dict())

@router.get("/menu/list", response_model=List[MenuOut])
def get_menulist(db: Session = Depends(get_db)):
    service = MenuService(db)
    return service.get_menus()