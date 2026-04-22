from sqlalchemy import and_
from sqlalchemy.orm import Session
from src.models.staff import Staff
from src.models.address import Address
from fastapi import HTTPException, status 
from typing import List, Optional
from src.schemas.staff import StaffBase
from src.repositories.base import BaseRepository
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from src.models.master import Department
from src.models.user import User, user_group

class StaffRepository(BaseRepository[Staff]):
    def __init__(self, db: Session):
        super().__init__(db, Staff)
    
    def create_staff(self, staff_data: dict) -> Staff:
        """Create a staff record linked to an existing user."""
        try:
            obj = Staff(**staff_data)
            self.db.add(obj)
            self.db.flush()
            self.commit()
            self.refresh(obj)
            return obj
        
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                    detail={
                        "message": f"Error creating Faculty: {str(e)}",
                        "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        "status": False
                    }
                )

    def get_staff_by_email(self, email: str) -> Optional[Staff]:
        """Retrieve a staff by email.

        Args:
            email (str): Email address to query.

        Returns:
            Optional[Staff]: Staff object if found, else None.
        """
        try:
            return self.db.query(Staff).filter(Staff.email == email).first()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error retrieving staff by email: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )
            
    def commit(self):
        """Commit the current transaction."""
        self.db.commit()

    def refresh(self, obj):
        """Refresh an object from the database.

        Args:
            obj: Object to refresh.
        """
        self.db.refresh(obj)

    def get_staff(self) -> List[Staff]:
        """Retrieve a list of staff Returns:List[staff]: List of staff objects."""
        try:
            staff_list = (
                self.db.query(
                    Staff,
                    Department.name.label("department_name")
                )
                .outerjoin(
                    Department,
                    Staff.department_code == Department.id
                )
                .all()
            )

            result = []

            for staff, department_name in staff_list:
                staff.department_name = department_name
                result.append(staff)

            return result

        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error retrieving staff: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )

    def get_by_staff_id(self, staff_id: int) -> Staff:
        """Retrieve a staff by ID with department name."""
        try:
            result = (
                self.db.query(
                    Staff,
                    Department.name.label("department_name"),
                )
                .outerjoin(
                    Department,
                    Staff.department_code == Department.id,
                )
                .filter(Staff.id == staff_id)
                .first()
            )

            if not result:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "staff not found",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False,
                    },
                )

            staff, department_name = result
            staff.department_name = department_name
            return staff

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error retrieving staff by ID: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Unexpected error retrieving staff by ID: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )

    def update_staff(self, staff: Staff, update_data: dict) -> Staff:
        """Update an existing staff's details.

        Args:
            staff (Staff): Existing staff object.
            update_data (dict): Data to update.

        Returns:
            Staff: Updated staff object.
        """
        try:
            for key, value in update_data.items():
                setattr(staff, key, value)
            self.db.add(staff)
            self.commit()
            self.refresh(staff)
            return staff
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error updating staff: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )
        
    def get_by_email(self, email: str):
        return self.db.query(Staff).filter(Staff.email == email).first()
    
    def get_by_phone(self, phone: str):
        return self.db.query(Staff).filter(Staff.phone == phone).first()
    
    def delete_staff(self, staff: Staff) -> Staff:
        """Delete a staff by ID.

        Args:
            staff (Staff): Staff object to delete.

        Returns:
            Staff: Deleted staff object.
        """
        try:
            self.db.delete(staff)
            self.commit()
            return staff
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error deleting staff: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )   

    def delete_staff_with_user(self, staff: Staff) -> Staff:
        """Delete a staff record and its linked user account.

        The `user_group` rows are removed first so the user can be deleted
        cleanly even without database-level cascade rules.
        """
        try:
            linked_user = (
                self.db.query(User)
                .filter(User.id == staff.user_id)
                .first()
            )

            self.db.query(user_group).filter(
                user_group.c.user_id == staff.user_id
            ).delete(synchronize_session=False)

            self.db.delete(staff)

            if linked_user:
                self.db.delete(linked_user)

            self.commit()
            return staff
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error deleting staff and linked user: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )
