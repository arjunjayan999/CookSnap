# CookSnap

CookSnap is a small full-stack project that detects ingredients from images and helps users manage recipes, pantry items, and favorites.

**Quick Overview**

- **Backend**: Node.js + Express API (in `backend/`).
- **Detector**: Python image-detector service (in `detector/`).
- **Frontend**: Vite + React app (in `frontend/`).

**Run (development)**
Use Docker Compose to start services locally (recommended):

```
docker-compose up --build
```

If you prefer to run services individually:

- Backend: `cd backend && npm install && npm run dev`
- Detector: `cd detector && pip install -r requirements.txt && python main.py`
- Frontend: `cd frontend && npm install && npm run dev`

**Files & structure**

- `backend/` — API server, routes, models, and controllers.
- `detector/` — image detector service (PyTorch model + Flask/FastAPI wrapper).
- `frontend/` — React UI (Vite).

**Next steps**

- See `backend/README.md`, `detector/README.md`, and `frontend/README.md` for per-service instructions and env variables.

---

_This README was generated to provide quick onboarding and per-folder READMEs were added._

## Docker (docker-compose)

This project includes a `docker-compose.yml` at the project root that brings up the frontend, backend, detector, and a MongoDB instance.

- Frontend: `http://localhost:5173` (Vite dev server)
- Backend API: `http://localhost:3000`
- Detector: `http://localhost:8000` (POST `/detect`)

Bring everything up with:

```bash
docker-compose up --build
```

Run in detached mode:

```bash
docker-compose up --build -d
```

Stop and remove containers:

```bash
docker-compose down
```

Notes:

- The `mongo` service uses a named volume `mongo_data` to persist data.
- Environment variables for the backend are read from the `environment` section in `docker-compose.yml` (you can override with `.env` or extend the compose file for production).
- The frontend Dockerfile runs the Vite dev server (good for development). For production you can replace the `frontend` service with a container that serves the built `dist` directory (nginx or static server).
