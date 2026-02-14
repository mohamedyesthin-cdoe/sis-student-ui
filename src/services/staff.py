from enum import Enum
from src.schemas.staff import *
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

    async def create_staff(self, data: StaffBase) -> dict:
        try:
            existing_user = self.user_repo.get_user_by_identifier(
                self.db,
                username=data.employee_id,
                email=data.email,
                phone=data.phone
            )

            if existing_user:
                if existing_user.username == data.employee_id:
                    detail = "User with this employee ID already exists."
                elif existing_user.phone == data.phone:
                    detail = "User with this phone already exists."
                else:
                    detail = "User with this email already exists."

                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, 
                    detail={
                        "message": detail,
                        "code": status.HTTP_409_CONFLICT,
                        "status": False
                    }
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
                )
            )

            staff_data = data.model_dump(exclude_none=True)
            staff_data["user_id"] = user.id
            # Convert enums to values
            for k, v in staff_data.items():
                if isinstance(v, Enum):
                    staff_data[k] = v.value

            staff_data["employment_type"] = data.employment_type

            staff = self.repo.create_staff(staff_data)
            print(staff)
            await send_credentials_email(data.email, data.employee_id, plain_password, fullname)
            
            return StaffResponse(
                message="Staff created successfully.",
                code=status.HTTP_201_CREATED,
                status=True,
                data=staff
            )

        except HTTPException:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail={
                    "message": "Error creating staff.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )  

        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, 
                detail={
                    "message": "Staff with this employee ID, email, or phone already exists.",
                    "code": status.HTTP_409_CONFLICT,
                    "status": False
                }
            )

        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail={
                    "message": "Database error occurred while creating staff.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )

    def get_staff(self) -> StaffListResponse :
        """Retrieve a list of staff

        Returns:
            List[Staff]: List of staff objects.
        """
        try:
            staff = self.repo.get_staff()
            print(staff)
            return StaffListResponse(
                message="Staff retrieved successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=staff
            )
        except Exception as e:
            return StaffListResponse(
                message=f"Error retrieving staff: {str(e)}",
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                status=False,
                data=[]
            )

    def get_by_staff_id(self, staff_id: int) -> List[Staff] :
        """Retrieve a list of staff

        Returns:
            List[Country]: List of staff objects.
        """
        try:
            staff = self.repo.get_by_staff_id(staff_id)
            return StaffResponse(
                message="Staff retrieved successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=staff
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail={
                    "message": "Error retrieving staff by ID.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )
        
    def update_staff(self, staff_id: int, data: StaffUpdate):

        try:
            staff = self.repo.get_by_staff_id(staff_id)

            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "Staff not found.",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )

            staff_data = data.model_dump(exclude_none=True)

            # Convert Enums
            for k, v in staff_data.items():
                if isinstance(v, Enum):
                    staff_data[k] = v.value

            updated_staff = self.repo.update_staff(staff, staff_data)

            return StaffResponse(
                message="Staff updated successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=updated_staff
            )

        except HTTPException:
            self.db.rollback()
            raise

        except IntegrityError:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "Duplicate entry detected while updating staff.",
                    "code": status.HTTP_400_BAD_REQUEST,
                    "status": False
                }
            )

        except Exception:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": "Error updating staff.",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )

    def delete_staff(self, staff_id: int):
        try:
            staff = self.repo.get_by_staff_id(staff_id)

            if not staff:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail={
                        "message": "Staff not found.",
                        "code": status.HTTP_404_NOT_FOUND,
                        "status": False
                    }
                )

            self.repo.delete_staff(staff)

            return StaffResponse(
                message="Staff deleted successfully.",
                code=status.HTTP_200_OK,
                status=True,
                data=None
            )

        except HTTPException:
            self.db.rollback()
            raise

        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "message": f"Error deleting staff: {str(e)}",
                    "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "status": False
                }
            )