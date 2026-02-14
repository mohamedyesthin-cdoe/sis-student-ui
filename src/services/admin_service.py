from typing import Optional, List
from fastapi import HTTPException, status
from src.schemas.admin import *
from src.repositories.admin import AdminRepositery
from src.models.user import Group
from sqlalchemy.exc import IntegrityError

class AdminService:
    def __init__(self, db):
        """Initialize the AdminService with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.admin_repo = AdminRepositery(db)

    async def create_role(self, role: GroupCreate) -> Group:
        """Create a new Role.

        Args:
            role (GroupCreate): Pydantic model containing role creation data (e.g., name).

        Returns:
            Group: Created role object.

        Raises:
            HTTPException: If the role name is already registered or if a database error occurs.
        """
        #check if role name already exist
        existing_role = self.admin_repo.get_role_by_name(role.name)
        if existing_role:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Role '{role.name}' already exists",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )
        
        # Prepare the new role object
        db_role =  self.admin_repo.create_role(role.dict())
        
        try:
            #commit the role creation
            self.admin_repo.commit()
            self.admin_repo.refresh(db_role)  # Ensure the object reflects the database state
        except IntegrityError as e:
            self.admin_repo.rollback()
            if "duplicate key value violates unique constraint" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Role '{role.name}' already exists",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Database error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )
        
        except Exception as e:
            self.admin_repo.rollback()
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Unexpected error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )
        return GroupResponse(
            message="Roles Created Successfully",
            code=status.HTTP_200_OK,
            status=True,
            data=db_role
        )
    
    async def get_role(self, role_id: int) -> Group:
        """Retrieve a Role by its ID.

        Args:
            role_id (int): ID of the role to retrieve.

        Returns:
            Group: Retrieved role object.

        Raises:
            HTTPException: If the role is not found.
        """
        db_role = self.admin_repo.get_role_by_id(role_id)
        if not db_role:
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail={
                        "message": f"Unexpected error: {str(e)}",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )
        return GroupResponse(
            message="Role Fetched Successfully",
            code=status.HTTP_200_OK,
            status=True,
            data=db_role
        )

    async def update_role(self, role_id: int, role_update: GroupCreate) -> Group:
        """Update an existing Role.

        Args:
            role_id (int): ID of the role to update.
            role_update (GroupUpdate): Pydantic model containing updated role data.
            db (Session): SQLAlchemy database session.

        Returns:
            Group: Updated role object.

        Raises:
            HTTPException: If the role is not found, name is already registered, or a database error occurs.
        """
        # Retrieve the existing role
        db_role = self.admin_repo.get_role_by_id(role_id)

        if not db_role:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Role with ID {role_id} not found",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )
                
        # Prepare update data, excluding unset fields
        update_data = role_update.dict(exclude_unset=True)

        # Check for duplicate name if it’s being updated
        if 'name' in update_data:
            existing_role = self.admin_repo.get_role_by_name(update_data['name'])
            if existing_role and existing_role.id != role_id :
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Role '{update_data['name']}' already exists",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )
        # Update the role
        updated_data = self.admin_repo.update_role(db_role, update_data)

        try:
            self.admin_repo.commit()
            self.admin_repo.refresh(updated_data)
        except IntegrityError as e:
            self.admin_repo.rollback()
            if "duplicate key value violates unique constraint" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Role name conflict: {str(e)}",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Database error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )
        except Exception as e:
            self.admin_repo.rollback()
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Unexpected error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )
        return GroupResponse(
            message="Roles Updated Successfully",
            code=status.HTTP_200_OK,
            status=True,
            data=updated_data
        )
    
    async def get_roles(self, name: Optional[str] = None) -> List[Group]:
        """Retrieve a list of group, optionally filtered by name.

        Returns:
            List[Group]: List of Group objects.
        """
        try:
            roles = self.admin_repo.get_roles()
            return GroupListResponse(
                message="Roles fetched Successfully",
                code=status.HTTP_200_OK,
                status=True,
                data=roles
            )
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail={
                        "message": f"Unexpected error: {str(e)}",
                        "code": status.HTTP_400_BAD_REQUEST,
                        "status": False
                    }
                )    
    async def delete_role(self, role_id: int) -> dict:
        """Delete an existing Role.

        Args:
            role_id (int): ID of the role to delete.
            db (Session): SQLAlchemy database session.

        Returns:
            dict: Success message.

        Raises:
            HTTPException: If the role is not found or a database error occurs.
        """
        # Retrieve the existing role
        db_role = self.admin_repo.get_role_by_id(role_id)
        if not db_role:
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail={
                        "message": f"Role with ID {role_id} not found",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )        
        try:
            self.admin_repo.delete_role(db_role)
            self.admin_repo.commit()
        except IntegrityError as e:
            self.admin_repo.rollback()
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Database error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )    
        except Exception as e:
            self.admin_repo.rollback()
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Unexpected error: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )  
        return {"message": f"Role with ID {role_id} deleted successfully"}