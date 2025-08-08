from sqlalchemy.orm import Session
from typing import List, Optional
from src.models import Group

class AdminRepositery:
    def __init__(self, db:Session):
        self.db = db
    
    def get_role_by_name(self, name: str) -> Optional[Group]:
        """Retrieve a role by name."""
        return self.db.query(Group).filter(Group.name == name).first()

    def get_role_by_id(self, role_id: int) -> Optional[Group]:
        """Retrieve a role by id."""
        return self.db.query(Group).filter(Group.id == role_id).first()

    def create_role(self, role_data: dict) -> Group:
        """Create a new role.

        Args:
            role_data (dict): Dictionary containing role data (e.g., {'name': 'test'}).

        Returns:
            Group: Created role object.

        Raises:
            IntegrityError: If a database constraint (e.g., unique name) is violated.
        """
        db_role = Group(**role_data)
        self.db.add(db_role)
        return db_role
    
    def update_role(self, role:Group, role_data: dict) -> Group:
        """Update an existing role."""
        
        for key, value in role_data.items():
            if value is not None:
                setattr(role, key, value)

        self.db.add(role)
        return role

    def commit(self):
        """Commit the current transaction."""
        self.db.commit()

    def rollback(self):
        """Roll back the current transaction."""
        self.db.rollback()

    def delete_role(self, role: Group):
        """Delete an existing role."""
        self.db.delete(role)

    def refresh(self, obj):
        """Refresh an object from the database.

        Args:
            obj: Object to refresh.
        """
        self.db.refresh(obj)   
        
    def get_roles(self, name: Optional[str] = None) -> List[Group]:
        """Retrieve a list of Roles, optionally filtered by name.

        Args:
            name (Optional[str]): Filter roles by name (case-insensitive, partial match).

        Returns:
            List[Roles]: List of Roles objects.
        """
        query = self.db.query(Group)
        return query.all()