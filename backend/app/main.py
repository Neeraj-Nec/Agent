from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.agents.registry.agent_registry import AgentRegistry
from app.api.router import api_router
from app.core.config import get_settings
from app.services.agent_service import AgentService
from app.services.chat_service import ChatService

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    registry = AgentRegistry()
    app.state.agent_registry = registry
    app.state.agent_service = AgentService(registry)
    app.state.chat_service = ChatService()
    yield


app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    return {"service": settings.app_name, "status": "ready"}
