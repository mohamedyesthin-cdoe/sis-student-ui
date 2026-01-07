from src.schemas.staff import StaffCreate, StaffBase
from src.schemas.user import UserCreate
from src.repositories.staff import StaffRepository
from src.repositories.user import UserRepository
from fastapi import HTTPException, status
from src.models.staff import Staff
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.hash import generate_password, hash_password
from src.utils.email import send_credentials_email
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.utils.logger import setup_logger

logger = setup_logger()

class StaffService:
    def __init__(self, db: Session):
        """Initialize the StaffService with a database session.

        Args:
            db (Session): SQLAlchemy database session.
        """
        self.db = db
        self.repo = StaffRepository(db)
        self.user_repo = UserRepository()
    
    def create_staff(self, data: StaffBase) -> dict:
        try:
            # Check if user already exists
            existing_user = self.user_repo.get_user_by_username(
                self.db, data.employee_id
            )
            if existing_user:
                logger.warning(
                    f"Attempt to create staff with existing employee ID: {data.employee_id}"
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this employee ID already exists."
                )

            # Create user
            password = generate_password()
            user_data = UserCreate(
                username=data.employee_id,
                email=data.email,
                first_name=data.first_name,
                last_name=data.last_name,
                phone=data.phone,
                password=password,
                group_id=data.role,
            )

            user = self.user_repo.create_user(self.db, user_data)

            # Create staff
            staff_data = data.model_dump(exclude_none=True)
            staff_data["user_id"] = user.id

            staff = self.repo.create_staff(self.db, staff_data)

            # Optional: send credentials email
            # await send_credentials_email(data.email, data.employee_id, password)

            logger.info(
                f"Staff created successfully with ID: {staff.id} "
                f"and linked User ID: {user.id}"
            )

            return {
                "id": staff.id,
                "user_id": user.id,
            }

        except HTTPException:
            self.db.rollback()
            raise

        except IntegrityError:
            self.db.rollback()
            logger.error(
                f"Integrity error while creating staff with email: {data.email} "
                f"or employee ID: {data.employee_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Staff with this email or employee ID already exists.",
            )

        except SQLAlchemyError as e:
            self.db.rollback()
            logger.error(f"Database error while creating staff: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error occurred while creating staff.",
            )

        except Exception as e:
            self.db.rollback()
            logger.exception("Unexpected error while creating staff")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred while creating staff.",
            )

    
    def get_staff(self) -> List[Staff] :
        """Retrieve a list of staff

        Returns:
            List[Staff]: List of staff objects.
        """
        return self.repo.get_staff()
    
    def get_by_staff_id(self, staff_id: int) -> List[Staff] :
        """Retrieve a list of staff

        Returns:
            List[Country]: List of staff objects.
        """
        return self.repo.get_by_staff_id(staff_id)