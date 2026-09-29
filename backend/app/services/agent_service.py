from app.agents.registry.agent_metadata import AgentMetadata
from app.agents.registry.agent_registry import AgentRegistry


class AgentService:
    def __init__(self, registry: AgentRegistry) -> None:
        self._registry = registry

    def list_agents(self) -> tuple[AgentMetadata, ...]:
        return self._registry.list_metadata()
