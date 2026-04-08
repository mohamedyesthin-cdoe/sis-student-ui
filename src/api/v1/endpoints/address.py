from fastapi import APIRouter, Depends, Query, status
from typing import List, Dict, Optional
from pytest import Session
from src.db.session import get_db
from src.services.address import GeoService
from src.schemas.address import (
    CountryResponse, StateResponse, CityResponse
)
router = APIRouter()

@router.get("/countries", response_model=List[CountryResponse])
async def get_countries(
    name: Optional[str] = Query(None, description="Filter by country name (case-insensitive)"),
    db: Session = Depends(get_db)):
    """Retrieve a list of countries"""
    service = GeoService(db)
    return service.get_countries()

@router.get("/countries/code/{country_id}", response_model=Dict[str,str])
async def get_country_code(country_id: int, db: Session = Depends(get_db)):
    """Retrieve a country by its ID."""
    service = GeoService(db)
    return service.get_country_code(country_id)

@router.get("/countries/{country_id}", response_model=CountryResponse)
async def get_country_by_id(country_id: int, db: Session = Depends(get_db)):
    """Retrieve the country code for a given country ID."""
    service = GeoService(db)
    return service.get_country_by_id(country_id)

@router.get("/states", response_model=List[StateResponse])
async def get_states(
    name: Optional[str] = Query(None, description="Filter by state name (case-insensitive)"),
    db: Session = Depends(get_db)):
    """Retrieve a list of states,"""
    service = GeoService(db)
    return service.get_states()

@router.get("/states/{country_id}", response_model=List[StateResponse])
async def get_states_by_country_id(country_id: int, db: Session = Depends(get_db)):
    """Retrieve a list of states for a given country id"""
    service = GeoService(db)
    return service.get_states_by_country_id(country_id)

@router.get("/states/{state_id}/{country_id}", response_model=StateResponse)
async def get_state_by_id(state_id: int, country_id: int, db: Session = Depends(get_db)):
    """Retrive state object for a given country id and state id based"""
    service = GeoService(db)
    return service.get_state_by_id(state_id, country_id)

@router.get("/city/{state_id}", response_model=List[CityResponse])
async def get_states_by_country_id(state_id: int, db: Session = Depends(get_db)):
    """Retrieve a list of states for a given country id"""
    service = GeoService(db)
    return service.get_city_by_state_id(state_id)