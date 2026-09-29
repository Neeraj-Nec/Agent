from pydantic import BaseModel
class ChatResponse(BaseModel):
    status: str
    detail: str
