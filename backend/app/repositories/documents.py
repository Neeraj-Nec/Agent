from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import DocumentModel


class DocumentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(self, document: DocumentModel) -> DocumentModel:
        self._db.add(document)
        await self._db.commit()
        await self._db.refresh(document)
        return document

    async def list(self, limit: int, offset: int) -> list[DocumentModel]:
        result = await self._db.scalars(
            select(DocumentModel).order_by(DocumentModel.created_at.desc()).limit(limit).offset(offset)
        )
        return list(result)

    async def get(self, document_id: UUID) -> DocumentModel | None:
        return await self._db.get(DocumentModel, document_id)

    async def delete(self, document: DocumentModel) -> None:
        await self._db.delete(document)
        await self._db.commit()
