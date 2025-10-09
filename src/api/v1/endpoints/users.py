from typing import List
from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.orm import Session
from src.core.security.dependencies import require_superuser
from src.schemas.user import UserCreate, UserOut, BulkUserCreateRequest
from src.services.user_service import UserService
from src.db.session import get_db
from src.models.user import User
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/add", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    try:
        service = UserService(db)
        return service.create_user(data)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create user: {str(e)}"
        )
    except Exception as e:
        #logger.error(f"Unexpected error creating user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
    
@router.post("/bulk-add", status_code=status.HTTP_201_CREATED)
def bulk_create_users(
    request: BulkUserCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Bulk create users and assign to a group.
    Generates passwords automatically.
    """
    try:
        service = UserService(db)
        return service.bulk_create_users(request.users, request.group_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to bulk create users: {str(e)}"
        )