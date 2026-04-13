from enum import Enum
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from src.schemas.staff import StaffBase, StaffResponse, StaffListResponse, StaffUpdate
from src.schemas.user import UserCreate
from src.repositories.staff import StaffRepository
from src.repositories.user import UserRepository
from src.models.staff import Staff
from src.utils.hash import generate_password, hash_password
from src.utils.email import send_credentials_email
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

    async def create_staff(self, data: StaffBase) -> StaffResponse:
        try:
            existing_user = self.user_repo.get_user_by_identifier(
                self.db,
                username=data.employee_id,
                email=data.email,
                phone=data.phone,
            )

            if existing_user:
                if getattr(existing_user, "username", None) == data.employee_id:
                    detail = "User with this employee ID already exists."
                elif getattr(existing_user, "phone", None) == data.phone:
                    detail = "User with this phone already exists."
                else:
                    detail = "User with this email already exists."

                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={
                        "message": detail,
                        "code": status.HTTP_409_CONFLICT,
                        "status": False,
                    },
                )

            plain_password = generate_password()
            hashed_password = hash_password(plain_password)
            fullname = f"{data.first_name} {data.last_name}"

            user = self.user_repo.create_user(
                self.db,
                UserCreate(
                    username=data.employee_id,
                    email=data.email,
                    first_name=data.first_name,
                    last_name=data.last_name,
                    phone=data.phone,
                    password=hashed_password,
                    group_id=data.role,
                ),
            )

            staff_data = data.model_dump(exclude_none=True)
            staff_data["user_id"] = user.id

            # Convert Enum values to primitives
            for k, v in list(staff_data.items()):
                if isinstance(v, Enum):
                    staff_data[k] = v.value

            # Ensure employment_type present
            staff_data["employment_type"] = data.employment_type

            staff = self.repo.create_staff(staff_data)

            # send credentials email (async)
            try:
                await send_credentials_email(data.email, data.employee_id, plain_password, fullname)
            except Exception as e:
                logger.error("Failed to send credentials email: %s", e)

            return StaffResponse(
                message="Staff created successfully.",
                code=status.HTTP_201_CREATED,
                status=True,
                data=staff,
            )

        except HTTPException:
            # preserve original HTTP errors (conflicts, validation, etc.)
            self.db.rollback()
            raise

        except IntegrityError as e:
            self.db.rollback()
            logger.error("IntegrityError creating staff: %s", e)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": "Staff with this employee ID, email, or phone already exists.",
                    "code": status.HTTP_409_CONFLICT,
                    "status": False,
                },
            )

        except SQLAlchemyError as e:
            self.db.rollback()
            logger.error("SQLAlchemyError creating staff: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": "Database error occurred while creating staff.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )

    def get_staff(self) -> StaffListResponse:
        """Retrieve a list of staff"""
        try:
            staff = self.repo.get_staff()
            return StaffListResponse(
                message="Staff retrieved successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=staff,
            )
        except Exception as e:
            logger.error("Error retrieving staff: %s", e)
            return StaffListResponse(
                message=f"Error retrieving staff: {str(e)}",
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                status=False,
                data=[],
            )

    def get_by_staff_id(self, staff_id: int) -> StaffResponse:
        """Retrieve a staff by its id and return StaffResponse."""
        try:
            staff = self.repo.get_by_staff_id(staff_id)
            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "Staff not found.",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False,
                    },
                )
            return StaffResponse(
                message="Staff retrieved successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=staff,
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Error retrieving staff by ID: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": "Error retrieving staff by ID.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )

    def update_staff(self, staff_id: int, data: StaffUpdate) -> StaffResponse:
        try:
            staff = self.repo.get_by_staff_id(staff_id)

            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "Staff not found.",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False,
                    },
                )

            staff_data = data.model_dump(exclude_none=True)

            # Convert Enums
            for k, v in list(staff_data.items()):
                if isinstance(v, Enum):
                    staff_data[k] = v.value

            updated_staff = self.repo.update_staff(staff, staff_data)

            return StaffResponse(
                message="Staff updated successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=updated_staff,
            )

        except HTTPException:
            self.db.rollback()
            raise

        except IntegrityError as e:
            self.db.rollback()
            logger.error("IntegrityError updating staff: %s", e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Duplicate entry detected while updating staff.",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "status": False,
                },
            )

        except Exception as e:
            self.db.rollback()
            logger.error("Error updating staff: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": "Error updating staff.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )

    def delete_staff(self, staff_id: int) -> StaffResponse:
        try:
            staff = self.repo.get_by_staff_id(staff_id)

            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "Staff not found.",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False,
                    },
                )

            self.repo.delete_staff(staff)

            return StaffResponse(
                message="Staff deleted successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=None,
            )

        except HTTPException:
            self.db.rollback()
            raise

        except Exception as e:
            self.db.rollback()
            logger.error("Error deleting staff: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error deleting staff: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False,
                },
            )