from sqlalchemy.orm import Session
from typing import Any, TypeVar, Generic, Optional, List, Type, Dict, Union
from sqlalchemy.exc import SQLAlchemyError
import os
from src.utils.hash import hash_password, generate_password
from src.models.user import User

T = TypeVar("T")

class RepositoryError(Exception):
    """Custom exception for repository errors."""
    pass

class BaseRepository(Generic[T]):
    """
    Generic repository for SQLAlchemy models, providing CRUD and query operations.

    Args:
        db (Session): SQLAlchemy session, managed externally (e.g., via FastAPI Depends).
        model (Type[T]): The SQLAlchemy model class to operate on.
    """
    DEFAULT_LIMIT = int(os.getenv("REPOSITORY_DEFAULT_LIMIT", 100))
    MAX_LIMIT = int(os.getenv("REPOSITORY_MAX_LIMIT", 1000))

    def __init__(self, db: Session, model: Type[T]):
        self.db = db
        self.model = model
        #self.logger = get_logger()

    def commit(self) -> None:
        """Commit the current transaction."""
        try:
            self.db.commit()
            #self.logger.info("Transaction committed successfully for model: %s", self.model.__name__)
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Transaction failed and rolled back for model: %s - Error: %s", self.model.__name__, str(e))
            raise e

    def rollback(self) -> None:
        """Roll back the current transaction."""
        self.db.rollback()
        #self.logger.warning("Transaction rolled back for model: %s", self.model.__name__)

    def delete(self, obj: T) -> T:
        """Delete an existing object."""
        try:
            self.db.delete(obj)
            #self.logger.info("Object deleted successfully for model: %s", self.model.__name__)
            self.commit()

        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Delete failed for %s: %s", self.model.__name__, str(e))
            raise e
    
    def refresh(self, obj: T) -> T:
        """Refresh an object from the database."""
        try:
            self.db.refresh(obj)
            #self.logger.debug("Object refreshed successfully for model: %s", self.model.__name__)
            return obj
        
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Refresh failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def create(self, obj_data: dict) -> T:
        """Create a new object."""

        if hasattr(obj_data, "dict"):
            obj_data = obj_data.dict()
        elif hasattr(obj_data, "model_dump"):
            obj_data = obj_data.model_dump()
        obj = self.model(**obj_data)
        self.db.add(obj)
        try:
            self.commit()
            self.refresh(obj)
            #self.logger.info("Object created successfully for model: %s", self.model.__name__)
            return obj
        
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Create failed for %s: %s", self.model.__name__, str(e))
            raise e
    
    def get_by_id(self, id:int) -> Optional[T]:
        """Retrieve an object by ID."""
        try:
            result = self.db.query(self.model).filter(self.model.id == id).first()
            #self.logger.debug("Retrieved object by ID %d for model: %s", id, self.model.__name__)
            return result
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Get by id failed for %s: %s", self.model.__name__, str(e))
            raise e

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Retrieve all objects with pagination."""
        try:
            results = self.db.query(self.model).offset(skip).limit(limit).all()
            #self.logger.debug("Retrieved %d objects for model: %s", len(results), self.model.__name__)
            return results
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Get all failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def update(self, obj: T, obj_data: dict) -> T:
        """Update an existing object."""
        try:
            for key, value in obj_data.items():
                setattr(obj, key, value)
            self.commit()
            self.refresh(obj)
            #self.logger.info("Object updated successfully for model: %s", self.model.__name__)
            return obj
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Update failed for %s: %s", self.model.__name__, str(e))
            raise e
    
    def filter(self, filters: Dict) -> List[T]:
        """Generic filter method for dynamic queries."""
        try:
            query = self.db.query(self.model)
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
            results = query.all()
            #self.logger.debug("Filtered %d objects for model: %s with conditions %s", len(results), self.model.__name__, filters)
            return results
        except SQLAlchemyError as e:
            self.rollback()
            #self.logger.error("Filter failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def get_by_ids(self, ids: List[int]) -> List[T]:
        """Retrieve multiple objects by their IDs."""
        try:
            objects = self.db.query(self.model).filter(self.model.id.in_(ids)).all()
            #self.logger.debug("Retrieved %d objects by IDs for model: %s", len(objects), self.model.__name__)
            return objects
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Get by ids failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def get_by_field(self, field_name: str, value: Any) -> Optional[T]:
        """Retrieve an object by a specific field."""
        try:
            obj = self.db.query(self.model).filter(getattr(self.model, field_name) == value).first()
            #self.logger.debug(f"Retrieved object by {field_name}={value}: {obj}")
            return obj
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Get by field failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def get_by_multiple_conditions(self, conditions: Dict[str, Any], skip: int = 0, limit: int = 100) -> List[T]:
        """Retrieve objects based on multiple conditions with pagination."""
        try:
            query = self.db.query(self.model)
            for field, value in conditions.items():
                query = query.filter(getattr(self.model, field) == value)
            objects = query.offset(skip).limit(limit).all()
            #self.logger.debug("Retrieved %d objects with conditions %s for model: %s", len(objects), conditions, self.model.__name__)
            return objects
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Get by conditions failed for %s: %s", self.model.__name__, str(e))
            raise e
        
    def count(self, conditions: Optional[Dict[str, Any]] = None) -> int:
        """Count objects matching optional conditions."""
        try:
            query = self.db.query(self.model)
            if conditions:
                for field, value in conditions.items():
                    query = query.filter(getattr(self.model, field) == value)
            count = query.count()
            #self.logger.debug("Counted %d objects with conditions %s for model: %s", count, conditions, self.model.__name__)
            return count
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Count failed for %s: %s", self.model.__name__, str(e))
            raise e

    def exists(self, id: int) -> bool:
        """Check if an object exists by ID."""
        try:
            exists = self.db.query(self.model).filter(self.model.id == id).scalar() is not None
            #self.logger.debug("Checked existence for ID %d for model: %s - Result: %s", id, self.model.__name__, exists)
            return exists
        except SQLAlchemyError as e:
            self.db.rollback()
            #self.logger.error("Exists check failed for %s: %s", self.model.__name__, str(e))
            raise e
        