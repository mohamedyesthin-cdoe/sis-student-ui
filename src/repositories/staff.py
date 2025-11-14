from sqlalchemy import and_
from sqlalchemy.orm import Session
from src.models.staff import Staff
from src.models.address import Address
from fastapi import HTTPException, status 
from typing import List, Optional
from src.schemas.staff import StaffBase
from src.repositories.base import BaseRepository
from sqlalchemy.exc import SQLAlchemyError

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
                detail=f"Error creating Faculty: {str(e)}",
            )

    def get_staff_by_email(self, email: str) -> Optional[Staff]:
        """Retrieve a staff by email.

        Args:
            email (str): Email address to query.

        Returns:
            Optional[Staff]: Staff object if found, else None.
        """
        return self.db.query(Staff).filter(Staff.email == email).first()
    
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
        """Retrieve a list of staff

        Returns:
            List[staff]: List of staff objects.
        """
        return self.db.query(Staff).all()
    
    def get_by_staff_id(self, staff_id: int) -> Staff:
        """Retrieve a list of staff

        Returns:
            List[staff]: List of staff objects.
        """
        staff = self.db.query(Staff).filter(staff.id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="staff not found")
        return self.db.query(staff).filter(staff.id == staff_id).first()
