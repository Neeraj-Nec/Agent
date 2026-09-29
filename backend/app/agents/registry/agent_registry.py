from app.agents.common.base_agent import BaseAgent
from app.agents.registry.agent_metadata import AgentMetadata


class AgentRegistry:
    def __init__(self) -> None:
        self._agents: dict[str, tuple[AgentMetadata, BaseAgent]] = {}

    def register(self, metadata: AgentMetadata, agent: BaseAgent) -> None:
        if metadata.agent_id in self._agents:
            raise ValueError(f"Agent already registered: {metadata.agent_id}")
        self._agents[metadata.agent_id] = (metadata, agent)

    def get(self, agent_id: str) -> tuple[AgentMetadata, BaseAgent]:
        try:
            return self._agents[agent_id]
        except KeyError as exc:
            raise LookupError(f"Unknown agent: {agent_id}") from exc

    def list_metadata(self) -> tuple[AgentMetadata, ...]:
        return tuple(metadata for metadata, _ in self._agents.values())
