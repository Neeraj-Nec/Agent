from fastapi import APIRouter, Depends

from app.api.dependencies import get_agent_service
from app.schemas.agents import AgentMetadataSchema
from app.services.agent_service import AgentService

router = APIRouter()


@router.get("", response_model=list[AgentMetadataSchema])
async def list_agents(
    service: AgentService = Depends(get_agent_service),
) -> list[AgentMetadataSchema]:
    return [
        AgentMetadataSchema(
            agent_id=agent.agent_id,
            name=agent.name,
            description=agent.description,
            capabilities=list(agent.capabilities),
            version=agent.version,
            status=agent.status,
        )
        for agent in service.list_agents()
    ]
