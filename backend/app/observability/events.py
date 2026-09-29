from dataclasses import dataclass
from datetime import datetime
from typing import Any, Literal
EventType = Literal["agent_started","agent_completed","tool_started","tool_completed","retrieval_started","retrieval_completed","generation_started","message","error","final_response"]
@dataclass(frozen=True)
class AgentEvent:
    event_type: EventType
    execution_id: str
    timestamp: datetime
    payload: dict[str, Any]
