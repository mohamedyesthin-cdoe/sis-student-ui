from src.schemas.faculty import FacultyCreate
from src.repositories.faculty import FacultyRepository
from src.repositories.address import GeoRepository
from src.services.address import GeoService
from fastapi import HTTPException
from src.models.faculty import Faculty
from typing import List, Optional
from sqlalchemy.orm import Session
    
class FacultyService:
    def __init__(self, db: Session):
        """Initialize the FacultyService with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.db = db
        self.repo = FacultyRepository(db)
        self.geo_service = GeoService(db)
    
    def get_faculty(self) -> List[Faculty] :
        """Retrieve a list of faculty

        Returns:
            List[Country]: List of faculty objects.
        """
        return self.repo.get_faculty()
    
    def get_by_faculty_id(self, faculty_id: int) -> List[Faculty] :
        """Retrieve a list of faculty

        Returns:
            List[Country]: List of faculty objects.
        """
        return self.repo.get_by_faculty_id(faculty_id)