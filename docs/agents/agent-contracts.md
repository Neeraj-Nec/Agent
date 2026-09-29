# Agent contracts

Agents implement the common asynchronous invocation interface and expose metadata with stable ID, name, description, capabilities, version, and lifecycle status. The registry maps IDs to implementations. Orchestration selects an agent; routes and UI do not embed agent-specific logic.

An agent may depend on any needed capability interfaces: model, tool, memory, RAG retrieval, or external service. RAG is optional. Keep transport schemas separate from internal agent state and persistence details outside the agent package.
