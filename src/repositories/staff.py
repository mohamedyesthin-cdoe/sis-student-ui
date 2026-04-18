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
                    Staff.department_id == Department.id
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
                    "status": False
                }
        )
    
    def get_by_staff_id(self, staff_id: int) -> Staff:
        """Retrieve a list of staff

        Returns:
            List[staff]: List of staff objects.
        """
        try:
            staff = self.db.query(Staff).filter(Staff.id == staff_id).first()
            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "staff not found",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )
            return staff
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error retrieving staff by ID: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
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
