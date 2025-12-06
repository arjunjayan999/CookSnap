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

```
cd backend
npm install
npm run dev
```

**Seed data**

- A seed script exists at `backend/scripts/seed.js`. Run `node scripts/seed.js` after starting the server (ensure DB env is set).

**Notes**

- The `detect` route proxies requests to the detector service; ensure the detector is running and the URL in `utils/detectProxy.js` is correct.
