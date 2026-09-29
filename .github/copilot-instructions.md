# Copilot and Codex instructions

## Product and architecture
This repository is the AI Research Workspace: a multi-agent product, not a RAG-only application. Agents are independently owned workflows and may use different combinations of models, tools, memory, RAG, or external services. RAG is a shared optional capability under backend/app/rag.

## Folder ownership
- frontend owns browser UI and typed HTTP/SSE clients. It must not import backend code or call LangGraph directly.
- backend/app/api owns HTTP validation and transport; routes delegate to application services.
- backend/app/services coordinates use cases and capabilities.
- backend/app/agents owns agent interfaces, orchestration, registry, and independent agent workflows/graphs.
- backend/app/tools, models, memory, and rag provide reusable optional capability boundaries.
- backend/app/repositories and database own persistence concerns; agents must not implement or import database adapters.
- docs and tests mirror architecture boundaries.

## Agent development
- Add one package per distinct agent workflow under backend/app/agents. An agent may be conversational, research-oriented, analytical, retrieval-based, or another domain workflow; do not assume every agent needs RAG.
- Keep agent-specific state, graph, and configuration inside its package. Graph construction stays in graph.py.
- Depend only on required capability interfaces. Use shared RAG when retrieval is needed rather than duplicating ingestion/vector-store code.
- Register stable ID and metadata through the registry/composition point. Avoid agent-specific selection branches throughout API or frontend.
- Keep tests for each agent isolated from API, shared RAG, and tool tests.

## Dependency and coding rules
- Keep dependencies acyclic and directed toward contracts. Use dependency injection where it supports replacement/testing; avoid decorative abstractions.
- Use typed Python boundaries, Pydantic transport schemas, strict TypeScript, focused modules, and environment-based configuration. Never commit secrets.
- Frontend features delegate operations to hooks/services; components focus on presentation.
- Keep API versioned, validate inputs, use consistent error contracts, and design streaming as backend-owned SSE events.
- Use fakes for model and external-service boundaries. Do not require live provider credentials in unit tests.
