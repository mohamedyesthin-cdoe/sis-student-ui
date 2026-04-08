from src.repositories.menu import MenuRepository
from fastapi import HTTPException

class MenuService:
    def __init__(self, db):
        self.repo = MenuRepository(db)

    def create_menu(self, menu_data: dict):
        return self.repo.create_menu(menu_data)

    def get_menu(self, menu_id: int):
        menu = self.repo.get_menu(menu_id)
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")
        menu.children = self.repo.get_submenus(menu_id)
        return menu

    def get_menus(self):
        menus = self.repo.get_menus()
        for menu in menus:
            menu.children = self.repo.get_submenus(menu.id)
        return menus

    def create_submenu(self, submenu_data: dict):
        menu = self.repo.get_menu(submenu_data['menu_id'])
        #menu_id = submenu_data['menu_id']
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")
        return self.repo.create_submenu(submenu_data)