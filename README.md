<div align="center">

# 🔭 Relescope

### Your Git history, beautifully summarized.

**An AI-powered release notes generator built from real GitHub commits.**

Relescope connects to GitHub, loads repository activity, lets developers choose the commits that belong to a release, and transforms them into structured, editable release notes.

<br />

[![CI](https://github.com/arshad-rahman/relescope/actions/workflows/ci.yml/badge.svg)](https://github.com/arshad-rahman/relescope/actions/workflows/ci.yml)
[![Latest Release](https://img.shields.io/github/v/release/arshad-rahman/relescope?display_name=tag&sort=semver)](https://github.com/arshad-rahman/relescope/releases/latest)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![GHCR](https://img.shields.io/badge/GHCR-Public_Images-181717?logo=github&logoColor=white)](https://github.com/arshad-rahman?tab=packages)

<br />

[Overview](#-overview) •
[Features](#-features) •
[Architecture](#-architecture) •
[Quick Start](#-quick-start-with-docker-compose) •
[Development](#-local-development) •
[CI/CD](#-cicd-and-release-engineering) •
[API](#-api-reference) •
[Security](#-security-model) •
[Release](#-release-v010)

</div>

---

## 📌 Overview

Writing release notes manually usually requires someone to:

1. Inspect a Git commit history.
2. Separate meaningful changes from maintenance work.
3. Group related commits.
4. Rewrite technical commit messages for users or stakeholders.
5. Identify contributors.
6. Format and distribute the final release notes.

Relescope automates this workflow using live GitHub repository data and an AI provider.

It supports two release-generation experiences:

- **Lite** — a guided workflow with automatic commit selection.
- **Advanced** — a configurable workspace with manual commit selection, filtering, calendar ranges, release settings, and developer targeting.

Generated releases can be edited, exported, saved to History, and resumed later.

The name **Relescope** combines **release** and **scope**: a clearer view of everything included in a software release.

---

## ✨ Features

### GitHub integration

| Feature | Description |
|---|---|
| **Live GitHub data** | Load accessible repositories, branches, commits, authors, and repository metadata. |
| **Private repositories** | Use a fine-grained GitHub personal access token with read-only repository access. |
| **Branch selection** | Select the branch whose history should be analysed. |
| **Real commit data** | Release notes are generated only from commits selected by the user. |
| **Contributor detection** | Build the contributor list directly from selected commit authors. |
| **Contributor deduplication** | Treat equivalent names such as `arshad rahman` and `arshad-rahman` as the same contributor. |

### Lite workflow

- Guided repository and branch selection.
- Automatic commit selection.
- Preset release ranges.
- Fast release-note generation.
- Editable output.
- Save and resume Lite releases.

### Advanced workflow

- Manual commit selection.
- Select all visible commits.
- Search by commit message.
- Filter by author.
- Generate for the full team or an individual developer.
- 7-day range.
- 14-day range.
- 30-day range.
- Custom calendar date range.
- Release title, version, and environment configuration.
- Save and resume Advanced releases.

### Release output

Generated results include:

```text
Summary
Features
Bug Fixes
Improvements
Documentation
Maintenance
Contributors
Total Commits
```

### Export and persistence

| Capability | Description |
|---|---|
| **Copy** | Copy generated notes as Markdown. |
| **Markdown** | Download a `.md` file. |
| **JSON** | Download structured release data as JSON. |
| **PDF** | Open a printable release layout that can be saved as PDF. |
| **Saved History** | Store generated releases in the application database. |
| **Release statuses** | Maintain releases as `draft`, `final`, or `published`. |
| **Resume workflow** | Reopen a saved release in Lite or Advanced mode. |
| **Persistent storage** | Docker Compose stores SQLite data in a named Docker volume. |

### AI providers

Relescope supports:

- Google Gemini
- OpenAI

The provider is selected through backend environment variables. AI keys are never embedded in the frontend image.

---

## 🔄 How Relescope Works

### Lite flow

```text
Connect GitHub
      ↓
Select repository and branch
      ↓
Choose a preset range
      ↓
Relescope selects matching commits
      ↓
Generate and edit release notes
      ↓
Export or save to History
```

### Advanced flow

```text
Connect GitHub
      ↓
Select repository and branch
      ↓
Choose date range
      ↓
Filter by author or search
      ↓
Manually select commits
      ↓
Configure release metadata
      ↓
Generate and edit release notes
      ↓
Export or save to History
```

---

## 🏗 Architecture

```mermaid
flowchart TD
    USER[Browser User]

    subgraph FRONTEND[Frontend Container]
        NGINX[Nginx :8080]
        REACT[React + TypeScript SPA]
    end

    subgraph BACKEND[Backend Container]
        API[FastAPI :8000]
        SERVICE[Release Generation Services]
        ORM[SQLAlchemy]
    end

    subgraph DATA[Persistent Data]
        DB[(SQLite Database)]
        VOLUME[Docker Named Volume]
    end

    subgraph EXTERNAL[External Services]
        GITHUB[GitHub REST API]
        GEMINI[Google Gemini API]
        OPENAI[OpenAI API]
    end

    MIGRATE[Alembic Migration Container]

    USER -->|HTTP| NGINX
    NGINX -->|Static files| REACT
    REACT -->|Same-origin /api| NGINX
    NGINX -->|Reverse proxy| API

    API --> SERVICE
    SERVICE --> GITHUB
    SERVICE --> GEMINI
    SERVICE --> OPENAI

    API --> ORM
    ORM --> DB
    DB --> VOLUME

    MIGRATE -->|alembic upgrade head| DB
```

### Container startup order

```text
migrate
   │
   ├── Runs Alembic migrations
   └── Exits successfully
          ↓
backend
   │
   ├── Starts FastAPI
   └── Must become healthy
          ↓
frontend
   │
   ├── Starts non-root Nginx
   ├── Serves React
   └── Proxies /api to FastAPI
```

### Request flow

```text
Browser
   │
   ├── Static application request
   ▼
Nginx
   │
   ├── /              → React SPA
   ├── /assets/*      → Static build assets
   ├── /healthz       → Frontend health check
   └── /api/*         → FastAPI backend
                           │
                           ├── GitHub REST API
                           ├── Gemini or OpenAI
                           └── SQLite database
```

---

## 🧰 Technology Stack

### Frontend

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- Tailwind CSS 4
- TanStack Query
- Axios
- Framer Motion
- Base UI
- shadcn
- Lucide React
- Sonner
- Oxlint
- Nginx

### Backend

- Python 3.13
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy 2
- Alembic
- SQLite
- HTTPX
- Google Gen AI SDK
- OpenAI SDK
- Python Dotenv
- `unittest`

### DevOps and delivery

- Docker
- Multi-stage Docker builds
- Docker Compose
- GitHub Actions
- GitHub Container Registry
- Semantic versioning
- Commit-SHA image tags
- Docker build cache
- Health checks
- Non-root containers
- Signed build provenance attestations

---

## 📁 Repository Structure

```text
relescope/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── publish-images.yml
│
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   │   ├── github.py
│   │   │   ├── release.py
│   │   │   ├── repository.py
│   │   │   └── saved_release.py
│   │   ├── schemas/
│   │   └── services/
│   ├── data/
│   ├── migrations/
│   ├── tests/
│   ├── .dockerignore
│   ├── .env.example
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── compose.yaml
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start with Docker Compose

Docker Compose is the recommended way to run the complete application locally.

### Prerequisites

Install:

- Git
- Docker Desktop or Docker Engine with Compose
- A GitHub account
- A fine-grained GitHub personal access token
- A Gemini API key or OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/arshad-rahman/relescope.git
cd relescope
```

### 2. Create the backend environment file

```bash
cp backend/.env.example backend/.env
```

For Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_private_gemini_key
```

For OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_private_openai_key
```

Never commit `backend/.env`.

### 3. Start the complete stack

```bash
docker compose up --build --detach
```

Compose will:

1. Build the backend image.
2. Build the frontend image.
3. Create the persistent database volume.
4. Run `alembic upgrade head`.
5. Start FastAPI.
6. Wait for backend health.
7. Start Nginx and React.

### 4. Inspect service state

```bash
docker compose ps --all
```

Expected general state:

```text
migrate    Exited (0)
backend    Up (healthy)
frontend   Up (healthy)
```

### 5. Open the application

```text
Application:     http://localhost:8080
Frontend health: http://localhost:8080/healthz
Backend:         http://localhost:8000
Backend health:  http://localhost:8000/health
Swagger docs:    http://localhost:8000/docs
```

### 6. View logs

```bash
docker compose logs migrate
docker compose logs backend
docker compose logs frontend
```

Follow running logs:

```bash
docker compose logs --follow backend frontend
```

### 7. Stop the application

```bash
docker compose down
```

This keeps saved releases in the named volume:

```text
relescope-backend-data
```

### Delete all local application data

> Warning: this permanently deletes saved releases from the Docker volume.

```bash
docker compose down --volumes
```

---

## 📦 Published Container Images

Release `v0.1.0` is available as public GHCR images.

### Backend

```bash
docker pull ghcr.io/arshad-rahman/relescope-backend:0.1.0
```

### Frontend

```bash
docker pull ghcr.io/arshad-rahman/relescope-frontend:0.1.0
```

### Available tags

```text
0.1.0
0.1
latest
sha-3586e89
```

### Verified v0.1.0 image digests

```text
Backend:
sha256:0fa2509ce08235c182871cd6e6faed3c7607a06be44e56906af8f0a6b713d3b2

Frontend:
sha256:3749f2d87754bb924e144b2b8fd538122f2a5eb18744ecc20ffe3b1f3bfb1f94
```

### Runtime users

```text
Backend:  relescope
Frontend: nginx
```

Both images run without root privileges.

---

## 💻 Local Development

### Backend setup

```bash
cd backend

python -m venv venv
```

Activate on Windows Git Bash:

```bash
source venv/Scripts/activate
```

Activate on Linux or macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create the environment file:

```bash
cp .env.example .env
```

Apply migrations:

```bash
alembic upgrade head
```

Start FastAPI:

```bash
python -m uvicorn main:app --reload
```

Backend URLs:

```text
http://127.0.0.1:8000
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

### Frontend setup

Open a second terminal:

```bash
cd frontend

npm ci
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start Vite:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## ⚙️ Environment Variables

### Core backend variables

| Variable | Required | Default | Description |
|---|---:|---|---|
| `AI_PROVIDER` | Yes | `gemini` | Select `gemini` or `openai`. |
| `DATABASE_URL` | No | Local SQLite file | SQLAlchemy database connection URL. |
| `CORS_ORIGINS` | No | Local ports `5173` and `8080` | Comma-separated allowed origins. |

### Gemini variables

| Variable | Required | Default | Description |
|---|---:|---|---|
| `GEMINI_API_KEY` | When Gemini is selected | — | Private Gemini API key. |
| `GEMINI_MODEL` | No | `gemini-3.1-flash-lite` | Gemini model name. |
| `GEMINI_MAX_OUTPUT_TOKENS` | No | `5000` | Maximum generated output tokens. |

Example:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_private_key
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=5000
```

### OpenAI variables

| Variable | Required | Default | Description |
|---|---:|---|---|
| `OPENAI_API_KEY` | When OpenAI is selected | — | Private OpenAI API key. |
| `OPENAI_MODEL` | No | `gpt-4.1-mini` | OpenAI model name. |
| `OPENAI_TIMEOUT_SECONDS` | No | `60` | AI request timeout. |
| `OPENAI_MAX_OUTPUT_TOKENS` | No | `4000` | Maximum generated output tokens. |

Example:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_private_key
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TIMEOUT_SECONDS=60
OPENAI_MAX_OUTPUT_TOKENS=4000
```

---

## 🔐 Security Model

### GitHub personal access token

Relescope currently uses a fine-grained GitHub personal access token.

Recommended configuration:

1. Set a short expiration date.
2. Select **Only select repositories**.
3. Choose only repositories that Relescope should analyse.
4. Set repository **Contents** permission to **Read-only**.
5. Do not grant write or administration permissions.

Create a token:

[GitHub fine-grained personal access token](https://github.com/settings/personal-access-tokens/new)

### Token handling

- The token is stored in browser `sessionStorage`.
- It remains available only for the current browser tab/session.
- It is removed when the user disconnects.
- It is sent to FastAPI only when a GitHub API request is required.
- It is not persisted in the application database.
- It is not embedded in the frontend Docker image.
- Relescope does not require repository write access.

### AI secret handling

- Gemini and OpenAI keys exist only in the backend runtime environment.
- AI keys are not Vite environment variables.
- AI keys are not copied into the frontend bundle.
- `.env` files are ignored by Git.
- `.env` files are excluded from Docker build contexts.
- CI uses non-secret placeholder values for tests that do not contact AI providers.

### Prompt safety and validation

Commit messages are treated as untrusted input.

The backend instructs AI providers to:

- Treat commit messages only as data.
- Ignore instructions contained inside commit messages.
- Avoid inventing functionality or outcomes.
- Use only supplied repository information.
- Include every selected commit exactly once.
- Reject unknown, missing, or duplicate commit IDs.

### Container security

- Backend runs as `uid=10001(relescope)`.
- Frontend runs as the non-root `nginx` user.
- Both images include health checks.
- Secrets are supplied only at runtime.
- Published images include signed build provenance attestations.

---

## 🌐 Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Product landing page. |
| `/connect` | Public | GitHub PAT connection and security guide. |
| `/lite` | Protected | Guided Lite release workflow. |
| `/dashboard` | Protected | Advanced release workspace. |
| `/history` | Protected | Saved release history and resume actions. |

Unknown routes redirect to `/`.

---

## 🔌 API Reference

Interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### General

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Backend status message. |
| `GET` | `/health` | Backend health check. |
| `GET` | `/docs` | Swagger documentation. |
| `GET` | `/openapi.json` | OpenAPI schema. |

### Repository validation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/repository/validate` | Validate a GitHub repository URL. |

### GitHub

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/github/connect` | Validate a token and load the GitHub user. |
| `POST` | `/api/github/repositories` | List repositories accessible to the token. |
| `POST` | `/api/github/branches` | List repository branches. |
| `POST` | `/api/github/commits` | Load commits from a selected branch. |

### Release generation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/releases/generate` | Generate structured release notes. |

### Saved releases

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/saved-releases` | Create a saved release. |
| `GET` | `/api/saved-releases` | List saved releases with filters and pagination. |
| `GET` | `/api/saved-releases/{release_id}` | Read one saved release. |
| `PATCH` | `/api/saved-releases/{release_id}` | Update release content or status. |
| `DELETE` | `/api/saved-releases/{release_id}` | Delete a saved release. |

List filters include:

- Owner login
- Release status
- Experience mode
- Repository
- Limit
- Offset

---

## 💾 Database and Migrations

Relescope uses:

- SQLAlchemy for persistence.
- SQLite for the current local and single-instance deployment model.
- Alembic for database schema versioning.

Default local database:

```text
backend/data/relescope.db
```

Docker database:

```text
/app/data/relescope.db
```

Docker Compose stores it in:

```text
relescope-backend-data
```

### Migration commands

Check the current migration:

```bash
cd backend
alembic current
```

Upgrade:

```bash
alembic upgrade head
```

Rollback all migrations:

```bash
alembic downgrade base
```

---

## 🧪 Testing

### Backend tests

```bash
cd backend
source venv/Scripts/activate

python -m unittest discover \
  -s tests \
  -p "test_*.py" \
  -v
```

Backend tests cover:

- Root endpoint
- Health endpoint
- OpenAPI document
- CORS behaviour
- Equivalent contributor-name deduplication
- Preservation of different contributors
- Empty contributor filtering

### Frontend checks

```bash
cd frontend

npm run lint
npm run build
```

### Docker Compose smoke test

```bash
docker compose up --build --detach
docker compose ps --all

curl -fsS http://localhost:8080/healthz
curl -fsS http://localhost:8000/health

docker compose down
```

---

## 🔄 CI/CD and Release Engineering

### Pull-request and `main` CI

The `CI` workflow runs on:

- Pull requests targeting `main`
- Pushes to `main`
- Manual workflow dispatch

It contains four jobs.

#### 1. Frontend checks

- Install dependencies using `npm ci`.
- Run Oxlint.
- Compile TypeScript.
- Build the Vite production bundle.

#### 2. Backend checks

- Install pinned Python dependencies.
- Run `pip check`.
- Compile Python files.
- Apply Alembic migrations.
- Run backend tests.
- Test migration rollback.
- Reapply migrations.
- Display migration state.

#### 3. Backend container checks

- Build the FastAPI image.
- Create a temporary database volume.
- Apply migrations inside the image.
- Start the backend container.
- Wait for Docker health.
- Test root and health endpoints.
- Confirm non-root execution.

#### 4. Frontend container integration checks

- Build backend and frontend images.
- Create a private Docker network and volume.
- Apply migrations.
- Start FastAPI under the network alias `backend`.
- Start Nginx and React.
- Wait for both containers to become healthy.
- Test SPA routes.
- Test FastAPI through the Nginx `/api` proxy.
- Verify no hardcoded localhost API URL exists in the frontend bundle.
- Confirm both containers run without root.

### Container publishing

Pushing a semantic-version tag matching:

```text
v*.*.*
```

triggers the image-publishing workflow.

For example:

```bash
git tag -a v0.1.0 -m "Relescope v0.1.0"
git push origin v0.1.0
```

The workflow:

1. Builds the backend and frontend images.
2. Logs in to GHCR using `GITHUB_TOKEN`.
3. Generates semantic-version metadata.
4. Pushes version, minor, latest, and commit-SHA tags.
5. Uses GitHub Actions build caching.
6. Creates signed build provenance attestations.

### Delivery pipeline

```text
Feature branch
      ↓
Pull request
      ↓
Four CI jobs
      ↓
Merge to main
      ↓
Post-merge CI
      ↓
Annotated semantic-version tag
      ↓
Build backend and frontend images
      ↓
Push to public GHCR
      ↓
Generate provenance attestations
      ↓
Create GitHub Release
```

---

## 🛠 Troubleshooting

### Docker Compose cannot start

Check Docker:

```bash
docker version
docker compose version
```

Inspect services:

```bash
docker compose ps --all
docker compose logs migrate
docker compose logs backend
docker compose logs frontend
```

### Migration service fails

```bash
docker compose logs migrate
```

Check the current migration:

```bash
docker compose run --rm migrate alembic current
```

### Frontend cannot reach FastAPI

In Docker, the frontend should use:

```env
VITE_API_URL=/api
```

Nginx proxies `/api` to:

```text
backend:8000
```

For Vite development, use:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### GitHub token is rejected

Confirm:

- The token has not expired.
- The correct repositories were selected.
- Repository Contents permission is Read-only.
- The token was copied completely.
- Organisation approval is complete when required.

### AI generation returns a configuration error

Check the selected provider and key:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=...
```

or:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=...
```

Restart the backend after changing environment variables:

```bash
docker compose restart backend
```

### AI model is unavailable

Override the model in `backend/.env`:

```env
GEMINI_MODEL=an_available_gemini_model
```

or:

```env
OPENAI_MODEL=an_available_openai_model
```

### PDF export does not open

Allow pop-ups for the Relescope frontend and try again.

### Saved releases disappeared

Do not run:

```bash
docker compose down --volumes
```

That command deletes the persistent database volume.

---

## ⚠️ Current Limitations

Version `0.1.0` currently has these limitations:

- GitHub authentication requires users to enter a fine-grained PAT manually.
- Tokens are session-based and are not shared across tabs or devices.
- There is no Relescope user-account or team-workspace system.
- The backend uses SQLite, which is designed for the current single-instance deployment model.
- Rate limiting and per-user AI usage quotas are not implemented yet.
- Public cloud deployment is not included in `v0.1.0`; public container images are available for deployment.
- Generated notes cannot yet be published directly to GitHub Releases.
- Scheduled weekly or monthly digests are not implemented.
- Multi-repository release generation is not implemented.
- Production monitoring and usage analytics are planned but not included yet.

---

## 🗺 Roadmap

### Completed

- [x] GitHub repository, branch, commit, and contributor integration
- [x] Private repository support with read-only fine-grained PATs
- [x] Lite release workflow
- [x] Advanced release workflow
- [x] Preset and custom calendar ranges
- [x] Multiple export formats
- [x] SQLite persistence
- [x] Release History
- [x] Resume Lite and Advanced releases
- [x] Alembic migrations
- [x] Backend Docker image
- [x] Multi-stage frontend Docker image
- [x] Docker Compose environment
- [x] Non-root containers
- [x] Container health checks
- [x] GitHub Actions CI
- [x] Full container integration testing
- [x] Public GHCR images
- [x] Semantic-version and commit-SHA tags
- [x] Signed provenance attestations
- [x] GitHub Release `v0.1.0`

### Planned

- [ ] Public deployment from GHCR images
- [ ] Production database strategy and automated backups
- [ ] Rate limiting and AI usage controls
- [ ] Application metrics and centralized logs
- [ ] Vulnerability and dependency scanning
- [ ] GitHub App or OAuth onboarding
- [ ] Direct publishing to GitHub Releases
- [ ] Scheduled release digests
- [ ] Multi-repository releases
- [ ] Team workspaces
- [ ] Saved release templates
- [ ] Usage analytics and audit logs

---

## 🏷 Release v0.1.0

The first public containerized release was created from:

```text
Tag:    v0.1.0
Commit: 3586e89
```

Release page:

[Relescope v0.1.0](https://github.com/arshad-rahman/relescope/releases/tag/v0.1.0)

Published images:

```text
ghcr.io/arshad-rahman/relescope-backend:0.1.0
ghcr.io/arshad-rahman/relescope-frontend:0.1.0
```

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a branch:

   ```bash
   git switch -c feature/your-feature-name
   ```

3. Make the change.
4. Run relevant tests.
5. Commit:

   ```bash
   git commit -m "feat: describe your change"
   ```

6. Push the branch.
7. Open a pull request targeting `main`.
8. Wait for all CI jobs to pass.

Never include:

- GitHub personal access tokens
- Gemini or OpenAI keys
- `.env` files
- Database files
- Other credentials

---

## 👤 Author

**Arshad Rahman M P**

DevOps Engineer • Cloud Infrastructure Engineer • Linux System Administrator

- GitHub: [@arshad-rahman](https://github.com/arshad-rahman)
- LinkedIn: [arshad-rahman-mp](https://www.linkedin.com/in/arshad-rahman-mp/)
- Email: [arshadmp004@gmail.com](mailto:arshadmp004@gmail.com)

---

## ⭐ Support

Relescope is a DevOps portfolio project built to solve a real software-delivery workflow problem.

A GitHub star helps others discover the project.

<div align="center">

**Built with GitHub, React, FastAPI, Gemini, OpenAI, Docker, GitHub Actions, and GHCR.**

</div>
