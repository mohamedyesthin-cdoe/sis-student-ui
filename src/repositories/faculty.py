from sqlalchemy import and_
from sqlalchemy.orm import Session
from src.models.faculty import Faculty
from src.models.address import Address
from fastapi import HTTPException, status 
from typing import List, Optional

class FacultyRepository:
    def __init__(self, db: Session):
        """Initialize the FacultyRepository with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.db = db
    
    def get_faculty_by_email(self, email: str) -> Optional[Faculty]:
        """Retrieve a faculty by email.

        Args:
            email (str): Email address to query.

        Returns:
            Optional[Faculty]: Faculty object if found, else None.
        """
        return self.db.query(Faculty).filter(Faculty.email == email).first()
    
    def create_faculty(self, faculty_data: dict) -> Faculty:
        """Create a new faculty in the database.

        Args:
            faculty_data (dict): faculty data including country_id and phone_number.

        Returns:
            faculty: Created faculty object.
        """
        db_faculty = Faculty(**faculty_data)
        self.db.add(db_faculty)
        self.db.flush()  # Flush to get faculty ID
        return db_faculty
    
    def create_address(self, address_data: dict) -> Address:
        """Create a new address for a faculty.

        Args:
            address_data (dict): Address data including faculty_id, country_id, and state_id.

        Returns:
            Address: Created address object.
        """
        db_address = Address(**address_data)
        self.db.add(db_address)
        return db_address
    
    def commit(self):
        """Commit the current transaction."""
        self.db.commit()

    def refresh(self, obj):
        """Refresh an object from the database.

        Args:
            obj: Object to refresh.
        """
        self.db.refresh(obj)

    def get_faculty(self) -> List[Faculty]:
        """Retrieve a list of faculty

        Returns:
            List[faculty]: List of faculty objects.
        """
        return self.db.query(Faculty).all()
    
    def get_by_faculty_id(self, faculty_id: int) -> Faculty:
        """Retrieve a list of faculty

        Returns:
            List[faculty]: List of faculty objects.
        """
        faculty = self.db.query(Faculty).filter(faculty.id == faculty_id).first()
        if not faculty:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="faculty not found")
        return self.db.query(faculty).filter(faculty.id == faculty_id).first()
