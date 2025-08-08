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
        self.repo = FacultyRepository(db)
        self.geo_service = GeoService(db)

    def create_faculty(self, faculty: FacultyCreate) -> Faculty:
        """Create a new faculty with associated address.

        Args:
            faculty (FacultyCreate): Faculty creation data including address.

        Returns:
            faculty: Created faculty object.

        Raises:
            HTTPException: If email is already registered, phone number is too long,
                          or multiple default address are provided.
        """
        # Check if email already exists
        if self.repo.get_faculty_by_email(faculty.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Resolve country_name to country_id
        country_id = self.geo_service.get_country_by_id(faculty.country_id)
        # Handle phone number
        phone_number = None
        if faculty.phone_number:
            country_code = self.geo_service.get_country_code(country_id.id)
            phone_number = f"{country_code["country_code"]}{faculty.phone_number}"
            if len(phone_number) > 15:
                raise HTTPException(status_code=400, detail="Phone number with country code exceeds 15 characters")
            
        # Create faculty
        faculty_data = faculty.dict(exclude={"address", "country_id", "contact_preference"})
        faculty_data["country_id"] = country_id.id
        faculty_data["phone_number"] = phone_number

        # Create faculty
        db_faculty = self.repo.create_faculty(faculty_data)

        # Create address
        if faculty.address:
            default_count = sum(1 for addr in faculty.address if addr.is_default)
            if default_count > 1:
                raise HTTPException(status_code=400, detail="Only one address can be set as default")

            for addr in faculty.address:
                country_id = self.geo_service.get_country_by_id(country_id.id)
                state_id = self.geo_service.get_state_by_id(addr.state_id, country_id.id)
                address_data = addr.dict(exclude={"country_id", "state_id"})
                address_data.update({
                    "faculty_id": db_faculty.id,
                    "country_id": country_id.id,
                    "state_id": state_id.id
                })
                self.repo.create_address(address_data)
        
        # Commit transaction
        self.repo.commit()
        self.repo.refresh(db_faculty)
        return db_faculty  

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