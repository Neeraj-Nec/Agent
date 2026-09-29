from fastapi import Request

from app.services.agent_service import AgentService
from app.services.chat_service import ChatService


def get_chat_service(request: Request) -> ChatService:
    return request.app.state.chat_service


def get_agent_service(request: Request) -> AgentService:
    return request.app.state.agent_service
