# System architecture

AI Research Workspace presents multiple agent workflows behind a consistent product/API boundary. The frontend communicates only with FastAPI. Routes delegate to services; services coordinate orchestration and persistence; orchestration resolves agents through a registry. Agents choose only the capabilities they need. RAG is shared infrastructure available to retrieval-oriented agents, not the root of the whole design.

    React workspace -> API -> services -> orchestration -> agent registry -> selected agent
    selected agent -> optional models / tools / memory / RAG / external services
    services -> repository interfaces -> persistence adapters

This keeps product experiences and agent workflows extensible without coupling them to a specific model provider, vector store, or database.
