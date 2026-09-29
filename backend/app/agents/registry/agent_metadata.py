from dataclasses import dataclass
@dataclass(frozen=True)
class AgentMetadata:
    agent_id: str
    name: str
    description: str
    capabilities: tuple[str, ...]
    version: str
    status: str = "planned"
