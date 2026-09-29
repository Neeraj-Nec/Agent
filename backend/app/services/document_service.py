import hashlib
from pathlib import Path
from uuid import UUID, uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.database.models import DocumentModel
from app.repositories.documents import DocumentRepository


class UploadTooLargeError(ValueError):
    pass


class DocumentService:
    def __init__(self, db: AsyncSession) -> None:
        self._repository = DocumentRepository(db)
        self._storage_path = get_settings().document_storage_path
        self._max_upload_bytes = get_settings().max_upload_bytes

    async def create(self, upload: UploadFile) -> DocumentModel:
        file_name = Path(upload.filename or "upload").name
        storage_key = f"{uuid4().hex}.blob"
        self._storage_path.mkdir(parents=True, exist_ok=True)
        target = self._storage_path / storage_key
        size = 0
        digest = hashlib.sha256()
        try:
            with target.open("wb") as destination:
                while chunk := await upload.read(1024 * 1024):
                    size += len(chunk)
                    if size > self._max_upload_bytes:
                        raise UploadTooLargeError("Upload exceeds the configured size limit.")
                    digest.update(chunk)
                    destination.write(chunk)
            record = DocumentModel(
                file_name=file_name,
                media_type=upload.content_type or "application/octet-stream",
                size_bytes=size,
                sha256=digest.hexdigest(),
                storage_key=storage_key,
            )
            return await self._repository.create(record)
        except Exception:
            target.unlink(missing_ok=True)
            raise
        finally:
            await upload.close()

    async def list(self, limit: int, offset: int) -> list[DocumentModel]:
        return await self._repository.list(limit, offset)

    async def get(self, document_id: UUID) -> DocumentModel | None:
        return await self._repository.get(document_id)

    async def delete(self, document: DocumentModel) -> None:
        target = self._storage_path / document.storage_key
        await self._repository.delete(document)
        target.unlink(missing_ok=True)
