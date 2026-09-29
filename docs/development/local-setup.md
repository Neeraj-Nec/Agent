# Run AI Research Workspace locally

## Prerequisites

- Node.js and npm
- Python 3.11 or newer
- Docker Desktop with Docker Compose

## Install dependencies

From the repository root, install frontend packages:

    npm install

Create and install the backend environment once:

    cd backend
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    python -m pip install -r requirements/dev.txt
    cd ..

## Start PostgreSQL

From the repository root:

    docker compose up -d database

The local database is available at localhost:5432. Development credentials are set in docker-compose.yml. Do not reuse them outside local development.

## Initialize the local database

From the repository root:

    cd backend
    .\.venv\Scripts\Activate.ps1
    python -m app.database.init_db
    cd ..

This creates the initial tables for local development. Production deployments should use versioned migrations.

## Start the applications

Use two terminals, both opened at the repository root.

Frontend terminal:

    npm run dev

Open the Vite URL printed in the terminal, normally http://localhost:5173.

Backend terminal:

    cd backend
    .\.venv\Scripts\Activate.ps1
    uvicorn app.main:app --reload

The backend OpenAPI page is at http://127.0.0.1:8000/docs. Health is at http://127.0.0.1:8000/api/v1/health. Agent discovery is at http://127.0.0.1:8000/api/v1/agents.

Stop either development server with Ctrl+C. Stop the local database with docker compose down. Database data persists in the named Docker volume.

## Current API behavior

- Sessions: create, list, get, and delete records in PostgreSQL.
- Documents: upload, list, get metadata, download, and delete. File bytes are kept under backend/var/documents for local development; PostgreSQL stores metadata. Uploads are limited to 25 MiB.
- Agent discovery returns registered agents. The list is empty until an agent is registered.
- Chat returns HTTP 501 until agent execution is configured.
- Document ingestion, RAG processing, authentication, and production file/object storage are not implemented.
