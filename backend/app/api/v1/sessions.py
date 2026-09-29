from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.dependencies import get_session_service
from app.database.models import SessionModel
from app.schemas.requests import SessionCreateRequest
from app.schemas.responses import SessionResponse
from app.services.session_service import SessionService

router = APIRouter()


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    request: SessionCreateRequest,
    service: SessionService = Depends(get_session_service),
) -> SessionModel:
    return await service.create(request.title)


@router.get("", response_model=list[SessionResponse])
async def list_sessions(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service: SessionService = Depends(get_session_service),
) -> list[SessionModel]:
    return await service.list(limit, offset)


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: UUID,
    service: SessionService = Depends(get_session_service),
) -> SessionModel:
    session = await service.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: UUID,
    service: SessionService = Depends(get_session_service),
) -> Response:
    session = await service.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found.")
    await service.delete(session)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
