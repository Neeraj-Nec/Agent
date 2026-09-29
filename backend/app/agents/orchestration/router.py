from app.agents.registry.agent_registry import AgentRegistry
class AgentRouter:
    def __init__(self, registry: AgentRegistry) -> None: self.registry = registry
    def resolve(self, agent_id: str): return self.registry.get(agent_id)
