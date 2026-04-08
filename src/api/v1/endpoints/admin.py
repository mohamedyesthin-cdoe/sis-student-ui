from sqlalchemy.orm import Session
from src.schemas.admin import *
from src.db.session import get_db
from src.services.admin_service import AdminService
from fastapi import APIRouter, Depends, HTTPException,status
from typing import List
from src.models.user import User
from src.core.security.dependencies import require_superuser
from src.schemas.admin import DocumentCreate
#from src.models.admin import Document

router = APIRouter()

@router.post("/roles/add", response_model = GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_roles(role: GroupCreate, db:Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Create a new role.

    Args:
        role (GroupCreate): Role creation data.
        db (Session): Database session.

    Returns:
        GroupResponse: Created role details.

    Raises:
        HTTPException: If the role name is already registered or if a database error occurs.
    """
    service = AdminService(db)
    created_role = await service.create_role(role)
    return created_role

@router.get("/roles/{role_id}", response_model=GroupResponse, status_code=status.HTTP_200_OK)
async def get_role(role_id:int, db:Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Retrieve a role by its ID.

    Args:
        role_id (int): ID of the role to retrieve.
        db (Session): Database session.

    Returns:
        GroupResponse: Retrieved role details.

    Raises:
        HTTPException: If the role is not found or a database error occurs.
    """
    service = AdminService(db)
    role = await service.get_role(role_id)
    return role

@router.put("/update/{role_id}", response_model=GroupResponse, status_code=status.HTTP_200_OK)
async def update_role(role_id:int, role_update:GroupUpdate, db:Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Update an existing role.

    Args:
        role_id (int): ID of the role to update.
        role_update (GroupUpdate): Updated role data (name and/or description).
        db (Session): Database session.

    Returns:
        GroupResponse: Updated role details.

    Raises:
        HTTPException: If the role is not found, name is already registered, or a database error occurs.
    """
    service = AdminService(db)
    updated_role = await service.update_role(role_id, role_update)
    return updated_role

@router.get("/roles", response_model = GroupListResponse)
async def get_roles(db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):

    """Retrieve a list of roles"""

    service =  AdminService(db)
    response = await service.get_roles()
    return response

@router.delete("/delete/{role_id}", status_code=status.HTTP_200_OK)
async def delete_role(role_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_superuser)):
    """Delete an existing role.

    Args:
        role_id (int): ID of the role to delete.
        db (Session): Database session.

    Returns:
        dict: Success message.

    Raises:
        HTTPException: If the role is not found or a database error occurs.
    """
    service = AdminService(db)
    response = await service.delete_role(role_id)
    return response

# class DocumentRepository:
#     @staticmethod
#     def create(db: Session, document: DocumentCreate, file_url: str):
#         db_doc = Document(
#             title=document.title,
#             description=document.description,
#             uploaded_by=document.uploaded_by,
#             file_url=file_url
#         )
#         db.add(db_doc)
#         db.commit()
#         db.refresh(db_doc)
#         return db_doc

#     @staticmethod
#     def get_all(db: Session):
#         return db.query(Document).order_by(Document.created_at.desc()).all()

#     @staticmethod
#     def delete(db: Session, document_id: int):
#         doc = db.query(Document).filter(Document.id == document_id).first()
#         if doc:
#             db.delete(doc)
#             db.commit()
#         return doc