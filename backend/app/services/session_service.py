from uuid import UUID

from app.database.models import SessionModel
from app.repositories.sessions import SessionRepository


class SessionService:
    def __init__(self, repository: SessionRepository) -> None:
        self._repository = repository

    async def create(self, title: str | None) -> SessionModel:
        return await self._repository.create(title)

    async def list(self, limit: int, offset: int) -> list[SessionModel]:
        return await self._repository.list(limit, offset)

    async def get(self, session_id: UUID) -> SessionModel | None:
        return await self._repository.get(session_id)

    async def delete(self, session: SessionModel) -> None:
        await self._repository.delete(session)
