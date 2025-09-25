from sqlalchemy import and_
from sqlalchemy.orm import Session
from src.models.faculty import Faculty
from src.models.address import Address
from fastapi import HTTPException, status 
from typing import List, Optional
from src.schemas.faculty import FacultyBase

class FacultyRepository:
    def __init__(self, db: Session):
        """Initialize the FacultyRepository with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.db = db
    
    def create(self, user_id: int, faculty_in: FacultyBase) -> Faculty:
        """
        Create a Faculty row linked to an existing user (user_id).
        `faculty_in` should contain faculty-only fields (FacultyBase or similar).
        """
        obj = Faculty(id=user_id, **(faculty_in.dict(exclude_none=True)))
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_faculty_by_email(self, email: str) -> Optional[Faculty]:
        """Retrieve a faculty by email.

        Args:
            email (str): Email address to query.

        Returns:
            Optional[Faculty]: Faculty object if found, else None.
        """
        return self.db.query(Faculty).filter(Faculty.email == email).first()
    
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
