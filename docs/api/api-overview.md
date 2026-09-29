# API overview

All routes are versioned under /api/v1. OpenAPI/Swagger UI is available at /docs.

- GET /health: API process health.
- GET /agents: metadata for registered agent implementations. Empty until agents are registered.
- POST /chat: reserved for agent execution; currently returns HTTP 501.
- /sessions: create, list, retrieve, and delete PostgreSQL-backed sessions.
- /documents: upload, list, retrieve metadata, download original content, and delete. PostgreSQL stores metadata; local development stores file bytes on disk.

Session and document endpoints require PostgreSQL to be running and initialized using python -m app.database.init_db from the backend directory. Document upload is limited to 25 MiB. Authentication, authorization, document parsing/ingestion, and production object storage are not implemented.
