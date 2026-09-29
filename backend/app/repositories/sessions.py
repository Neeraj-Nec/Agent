from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import SessionModel


class SessionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create(self, title: str | None) -> SessionModel:
        session = SessionModel(title=title)
        self._db.add(session)
        await self._db.commit()
        await self._db.refresh(session)
        return session

    async def list(self, limit: int, offset: int) -> list[SessionModel]:
        result = await self._db.scalars(
            select(SessionModel).order_by(SessionModel.created_at.desc()).limit(limit).offset(offset)
        )
        return list(result)

    async def get(self, session_id: UUID) -> SessionModel | None:
        return await self._db.get(SessionModel, session_id)

    async def delete(self, session: SessionModel) -> None:
        await self._db.delete(session)
        await self._db.commit()
