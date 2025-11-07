from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.session import get_db
from src.repositories.admin import DocumentRepository
from src.schemas.admin import DocumentCreate, DocumentOut
from src.utils.s3_service import DocumentService

router = APIRouter()

@router.post("/", response_model=DocumentOut)
async def upload_document(
    uploaded_by: str,
    file: UploadFile,
    db: Session = Depends(get_db)):
    
    service = DocumentService()
    repository = DocumentRepository(db)

    file_url = await service.upload_to_s3(file)
    document_data = DocumentCreate(filename=file.filename, uploaded_by=uploaded_by)
    new_doc = repository.create(document_data, file_url)

    return new_doc


@router.get("/", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)):
    repository = DocumentRepository(db)
    return repository.get_all()


@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    repository = DocumentRepository(db)
    service = DocumentService()

    document = repository.get_by_id(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    service.delete_from_s3(document.file_url)
    repository.delete(document)

    return {"detail": "Document deleted successfully"}
