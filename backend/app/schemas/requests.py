from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=20_000)
    agent_id: str | None = None
    session_id: str | None = None


class SessionCreateRequest(BaseModel):
    title: str | None = Field(default=None, max_length=200)
