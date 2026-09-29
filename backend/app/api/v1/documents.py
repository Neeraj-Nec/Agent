from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from fastapi.responses import FileResponse

from app.api.dependencies import get_document_service
from app.core.config import get_settings
from app.database.models import DocumentModel
from app.schemas.responses import DocumentResponse
from app.services.document_service import DocumentService, UploadTooLargeError

router = APIRouter()


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    service: DocumentService = Depends(get_document_service),
) -> DocumentModel:
    try:
        return await service.create(file)
    except UploadTooLargeError as exc:
        raise HTTPException(status_code=413, detail=str(exc)) from exc


@router.get("", response_model=list[DocumentResponse])
async def list_documents(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentModel]:
    return await service.list(limit, offset)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    service: DocumentService = Depends(get_document_service),
) -> DocumentModel:
    document = await service.get(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    return document


@router.get("/{document_id}/content")
async def download_document(
    document_id: UUID,
    service: DocumentService = Depends(get_document_service),
) -> FileResponse:
    document = await service.get(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    path = get_settings().document_storage_path / document.storage_key
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Stored file was not found.")
    return FileResponse(path, media_type=document.media_type, filename=document.file_name)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    service: DocumentService = Depends(get_document_service),
) -> Response:
    document = await service.get(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")
    await service.delete(document)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
