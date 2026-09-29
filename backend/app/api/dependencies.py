from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db_session
from app.services.agent_service import AgentService
from app.services.chat_service import ChatService
from app.services.document_service import DocumentService
from app.services.session_service import SessionService
from app.repositories.sessions import SessionRepository


async def get_database_session():
    async for session in get_db_session():
        yield session


def get_chat_service(request: Request) -> ChatService:
    return request.app.state.chat_service


def get_agent_service(request: Request) -> AgentService:
    return request.app.state.agent_service


async def get_session_service(
    db: AsyncSession = Depends(get_database_session),
) -> SessionService:
    return SessionService(SessionRepository(db))


async def get_document_service(
    db: AsyncSession = Depends(get_database_session),
) -> DocumentService:
    return DocumentService(db)
