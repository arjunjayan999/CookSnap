# Frontend

This folder contains the frontend application built with React + Vite.

**Quick Overview**

- Entry: `src/main.jsx` and `index.html`
- UI: Tailwind CSS + custom components in `src/components/` (incl. `ui/` primitives)
- Services: `src/services/api.js` (backend API wrapper)

**Run (development)**

From the repository root install workspace dependencies and run the frontend:

```
pnpm install
pnpm dev:frontend
```

Or run the frontend directly from its package:

```
pnpm -F frontend dev
```

**Build**

```
pnpm -F frontend build
```

**Notes**

- Environment variables for the frontend live in `frontend/.env`. Update API base URLs as needed.
