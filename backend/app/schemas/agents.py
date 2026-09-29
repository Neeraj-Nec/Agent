from pydantic import BaseModel


class AgentMetadataSchema(BaseModel):
    agent_id: str
    name: str
    description: str
    capabilities: list[str]
    version: str
    status: str
