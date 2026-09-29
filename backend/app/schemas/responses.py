from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ChatResponse(BaseModel):
    status: str
    detail: str


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str | None
    created_at: datetime
    updated_at: datetime


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_name: str
    media_type: str
    size_bytes: int
    sha256: str
    created_at: datetime
