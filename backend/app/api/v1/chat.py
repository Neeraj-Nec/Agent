from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_chat_service
from app.core.exceptions import CapabilityNotConfiguredError
from app.schemas.requests import ChatRequest
from app.schemas.responses import ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def create_chat(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    try:
        await service.create_chat(
            message=request.message,
            agent_id=request.agent_id,
            session_id=request.session_id,
        )
    except CapabilityNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(exc),
        ) from exc
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Agent execution is not configured.",
    )
