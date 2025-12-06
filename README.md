# CookSnap

CookSnap is a small full-stack project that detects ingredients from images and helps users manage recipes, pantry items, and favorites.

**Quick Overview**

- **Backend**: Node.js + Express API (in `backend/`).
- **Detector**: Python image-detector service (in `detector/`).
- **Frontend**: Vite + React app (in `frontend/`).

**Run (development)**
This repository uses `pnpm` workspaces. From the project root you can install dependencies and run services.

Install all workspace dependencies:

```
pnpm install
```

Run all services in parallel (development):

```
pnpm dev
```

Run services individually from the project root:

- Backend: `pnpm dev:backend` (or `pnpm -F backend dev`)
- Detector: `pnpm dev:detector` (use `pnpm -F detector install` first to create the Python venv)
- Frontend: `pnpm dev:frontend` (or `pnpm -F frontend dev`)

**Files & structure**

- `backend/` — API server, routes, models, and controllers.
- `detector/` — image detector service (PyTorch model + Flask/FastAPI wrapper).
- `frontend/` — React UI (Vite).

**Next steps**

- See `backend/README.md`, `detector/README.md`, and `frontend/README.md` for per-service instructions and env variables.

---

_This README was generated to provide quick onboarding and per-folder READMEs were added._

## Development Notes (pnpm workspace)

Service URLs (development defaults):

- Frontend: `http://localhost:5173` (Vite dev server)
- Backend API: `http://localhost:3000`
- Detector: `http://localhost:8000` (POST `/detect`)

Common commands (run from repository root):

```
pnpm install            # install workspace deps
pnpm dev                # run all dev services in parallel
pnpm build              # build frontend
pnpm start              # run start scripts in parallel (preview/server)

pnpm dev:frontend       # run frontend only
pnpm dev:backend        # run backend only
pnpm dev:detector       # run detector only
```

Notes:

- The detector uses Python and creates a virtual environment when you run `pnpm -F detector install`.
- Environment variables for each service are documented in the service READMEs.
- If you still want to run services individually without `pnpm` you can follow the per-service README instructions.
