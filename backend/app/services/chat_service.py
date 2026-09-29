from app.core.exceptions import CapabilityNotConfiguredError


class ChatService:
    async def create_chat(self, message: str, agent_id: str | None, session_id: str | None) -> None:
        raise CapabilityNotConfiguredError("Chat execution is not configured yet.")
