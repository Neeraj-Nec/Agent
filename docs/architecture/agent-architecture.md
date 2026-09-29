# Agent architecture

An agent is a separately owned workflow exposed through the common agent contract. Its package may contain state, graph construction, invocation interface, prompt/configuration, and agent-focused tests. The registry exposes stable IDs and metadata; orchestration selects and invokes an implementation.

Agents are not categorized by a required technology. Some may use retrieval through the shared RAG subsystem; others may use tools, models, memory, or a different workflow. Shared capability packages must not import individual agents. Agent code must not contain API routes, persistence implementation, or provider-specific SDK wiring.

Adding a new agent should require adding its package and registration, not changing unrelated agent packages.
