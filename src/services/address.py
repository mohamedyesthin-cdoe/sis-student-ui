from src.repositories.address import GeoRepository
from fastapi import HTTPException
from src.models.address import Country, State, Address
from typing import List, Optional
from sqlalchemy.orm import Session

class GeoService:
    def __init__(self, db):
        """Initialize the GeoService with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.repo = GeoRepository(db)

    def get_countries(self, name: Optional[str] = None) -> List[Country] :
        """Retrieve a list of countries, optionally filtered by name.

        Returns:
            List[Country]: List of Country objects.
        """
        return self.repo.get_countries()
    
    def get_country_by_id(self, country_id: int) -> Country:
        """Retrieve a country by its ID.

        Args:
            country_id (int): The ID of the country.

        Returns:
            Country: The Country object.
        """
        return self.repo.get_country_by_id(country_id)

    def get_country_code(self, country_id: int) -> dict:
        """Retrieve the country code for a given country ID.

        Args:
            country_id (int): The ID of the country.

        Returns:
            dict: Dictionary containing the country code.
        """
        country = self.repo.get_country_by_id(country_id)
        return {"country_code": country.country_code}
    
    def get_states(self, name: Optional[str] = None) -> List[State]:
        """Retrieve a list of states, optionally filtered by name.

        Returns:
            List[State]: List of State objects.
        """
        return self.repo.get_states()
    
    def get_states_by_country_id(self, country_id: int):
        """Retrieve a list of states for a given country ID.

        Args:
            country_id (int): The ID of the country.

        Returns:
            List[State]: List of State objects.
        """
        return self.repo.get_states_by_country_id(country_id)
    
    def get_state_by_id(self, state_id: int , country_id: int) -> State:
        """Retrieve a single state by state ID and country ID.

        Args:
            state_id (int): The ID of the state.
            country_id (int): The ID of the country.

        Returns:
            State: A single State object matching the IDs.
        """
        return self.repo.get_state_by_id(state_id, country_id)
    
    def get_city_by_state_id(self, state_id: int):
        """Retrieve a list of states for a given country ID.

        Args:
            country_id (int): The ID of the country.

        Returns:
            List[State]: List of State objects.
        """
        return self.repo.get_city_by_state_id(state_id)
    