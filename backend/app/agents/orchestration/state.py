from typing import TypedDict
class OrchestrationState(TypedDict, total=False):
    request: str
    selected_agent_id: str
    execution_id: str
    result: dict[str, object]
