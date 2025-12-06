# Backend

This folder contains the Node.js + Express API server for CookSnap.

**Quick Overview**

- **Entry**: `server.js`
- **Config**: `config/` (DB & Passport setup)
- **Routes**: `routes/` (auth, recipes, pantry, favorites, detect proxy)
- **Controllers**: `controllers/` (request handlers)
- **Models**: `models/` (Mongoose schemas)
- **Middleware**: `middleware/` (auth checks, error handling)

**Requirements**

- Node 16+ (use the version from `backend/package.json`)
- MongoDB connection (see `backend/.env`)

**Env**

- Copy `backend/.env` from project root or `.env.example` and set `MONGO_URI`, `JWT_SECRET`, and any OAuth keys.

**Run (development)**

From the repository root use the pnpm workspace commands. Install workspace dependencies once:

```
pnpm install
```

Run the backend in development:

```
pnpm dev:backend
```

Or target the package directly:

```
pnpm -F backend dev
```

**Seed data**

- A seed script exists at `backend/scripts/seed.js`. Run it from the repo root with:

```
pnpm -F backend seed
```

Ensure the backend can reach the MongoDB instance and required env vars are set before seeding.

**Notes**

- The `detect` route proxies requests to the detector service; ensure the detector is running and the URL in `utils/detectProxy.js` is correct.
