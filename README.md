# AI Research Workspace

A modular research workspace where users work with multiple independently developed AI agents. RAG is one capability that some agents may use; agents can also use tools, models, memory, external services, or their own workflows. This repository is a foundation, not a finished product.

    flowchart TD
      User --> React_Workspace --> FastAPI_Contracts
      FastAPI_Contracts --> Application_Services --> Agent_Orchestrator
      Agent_Orchestrator --> Agent_Registry --> Agent_Types
      Agent_Types --> Shared_Capabilities
      Shared_Capabilities --> Models_Tools_RAG_Memory_External_Services
      Agent_Orchestrator --> Persistence_Interfaces
      FastAPI_Contracts -->|Future SSE events| React_Workspace

## Run locally
See [the local setup guide](docs/development/local-setup.md) for installation and start commands.

## Major folders
- frontend: feature-based React/TypeScript workspace UI, API client, and streaming client. The React core remains suitable for a future Capacitor wrapper.
- backend/app/api: versioned HTTP transport and schemas.
- backend/app/services: application use cases such as conversations, agent catalog, and execution.
- backend/app/agents: agent contracts, registry, orchestration, and independently owned agent packages. This layer is intentionally open to many agent types.
- backend/app/tools, models, memory, and rag: shared optional capabilities. RAG is a reusable subsystem; non-RAG agents need not depend on it.
- backend/app/repositories and database: persistence contracts and adapters.
- infrastructure: cloud-neutral Docker, Terraform, and Kubernetes starting points.
- docs and tests: architecture/contracts and responsibility-specific test groups.

## Dependency flow
The browser calls FastAPI through HTTP/SSE contracts. Routes validate and delegate to application services. Services coordinate repositories and orchestration. The registry resolves an agent by stable ID. Each agent depends only on capabilities it uses: models, tools, memory, RAG retrieval, or external service interfaces. Agents do not import API or database implementations. Shared capabilities do not depend on specific agents.

## Agent extension model
Add an independent package under backend/app/agents for each distinct workflow or responsibility, implementing the common agent interface and its own graph/state/configuration as needed. Register metadata and implementation in the composition layer. Reuse shared capability interfaces when useful; do not make every agent a RAG agent or add RAG dependencies to agents that do not need retrieval. Keep agent selection in orchestration/registry, not scattered across routes or UI. See docs/agents/agent-contracts.md.

## Frontend request flow
A workspace feature calls a frontend service and typed API client. FastAPI validates the contract and invokes an application service. The service delegates execution to orchestration, which resolves the requested agent through the registry. Results return via response contracts or future SSE events. The frontend never imports LangGraph.

## Current scope
Health and agent discovery are available. Sessions and document metadata are stored in PostgreSQL; original uploaded files use local disk storage for development. Chat returns HTTP 501 until an agent is configured. Model calls, document parsing, RAG ingestion/retrieval, authentication, SSE transport, production object storage, versioned migrations, cloud resources, and CI checks remain incomplete. See the local setup guide before using document or session endpoints.
