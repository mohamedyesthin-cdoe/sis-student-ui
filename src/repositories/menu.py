from sqlalchemy.orm import Session
from src.models.menu import Menu, SubMenu

class MenuRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_menu(self, menu_data: dict):
        db_menu = Menu(**menu_data)
        self.db.add(db_menu)
        self.db.commit()
        self.db.refresh(db_menu)
        return db_menu

    def get_menu(self, menu_id: int):
        return self.db.query(Menu).filter(Menu.id == menu_id).first()

    def get_menus(self):
        return self.db.query(Menu).all()

    def create_submenu(self, menu_id: int, submenu_data: dict):
        db_submenu = SubMenu(**submenu_data)
        self.db.add(db_submenu)
        self.db.commit()
        self.db.refresh(db_submenu)
        return db_submenu

    def get_submenus(self, menu_id: int):
        return self.db.query(SubMenu).filter(SubMenu.menu_id == menu_id).all()