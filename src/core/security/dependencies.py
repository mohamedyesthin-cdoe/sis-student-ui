from fastapi import Depends, HTTPException, status
from src.core.security.jwt import get_current_user
from src.models.user import User

def require_superuser(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superuser privileges required"
        )
    return current_user