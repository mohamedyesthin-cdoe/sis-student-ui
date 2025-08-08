from sqlalchemy import and_
from sqlalchemy.orm import Session
from src.models.address import Country, State, Address
from fastapi import HTTPException, status 
from typing import List, Optional

class GeoRepository:
    def __init__(self, db:Session):
        """Initialize the GeoRepository with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.db = db
        
    def get_countries(self, name: Optional[str] = None) -> List[Country]:
        """Retrieve a list of countries, optionally filtered by name.

        Args:
            name (Optional[str]): Filter countries by name (case-insensitive, partial match).

        Returns:
            List[Country]: List of Country objects.
        """
        query = self.db.query(Country)
        return query.all()
    
    def get_country_by_id(self, country_id: int) -> Country :
        """Retrieve a country by its ID.

        Args:
            country_id (int): The ID of the country to retrieve.

        Returns:
            Country: The Country object.

        Raises:
            HTTPException: If the country is not found or country_id is invalid.
        """
        if not isinstance(country_id, int) or country_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid country ID")
        
        country = self.db.query(Country).filter(Country.id == country_id).first()
        
        if not country:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found")
        return country
    
    def get_states(self, name: Optional[str] = None) -> List[State] :
        """Retrieve a list of states, optionally filtered by name.

        Args:
            name (Optional[str]): Filter states by name (case-insensitive, partial match).

        Returns:
            List[State]: List of State objects.
        """
        query = self.db.query(State)
        return query.all()
    
    def get_states_by_country_id(self, country_id: int) -> List[State] :
        """Retrieve a list of states for a given country ID.

        Args:
            country_id (int): The ID of the country to filter states.

        Returns:
            List[State]: List of State objects.

        Raises:
            HTTPException: If country_id is invalid.
        """
        if not isinstance(country_id, int) or country_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid country ID")
        
        return self.db.query(State).filter(State.country_id == country_id).all()

    def get_state_by_id(self, state_id:int, country_id: int) -> State :
        """Retrieve a state by its ID and associated country ID.

        Args:
            state_id (int): The ID of the state.
            country_id (int): The ID of the country.

        Returns:
            State: State object matching both IDs.

        Raises:
            HTTPException: If IDs are invalid or state not found.
        """
        if not isinstance(country_id, int) or country_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid country ID")
        
        if not isinstance(state_id, int) or state_id <= 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state ID")

        state = self.db.query(State).filter(
            and_(
                State.id == state_id,
                State.country_id == country_id
            )
        ).first()

        if not state:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="State not found")

        return state
