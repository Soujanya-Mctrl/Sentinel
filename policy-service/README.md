Sentinel Policy Service (demo)

Lightweight backend using Express + Prisma + Postgres for demo/prototype.

Features:
- CRUD for policies (`/api/policies`)
- Submit proposals (`/api/proposals`)
- Worker that polls pending proposals and marks them processed (demo-only)

Quickstart

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install deps:

```bash
cd policy-service
npm install
npx prisma generate
npx prisma migrate dev --name init
```

3. Run the server:

```bash
npm run dev
```

4. Run the worker in another terminal:

```bash
npm run worker
```

Notes
- This is a demo scaffold. Production should add:
  - Authentication & authorization
  - Input validation
  - Robust error handling and retries
  - Replace polling with event-driven processing if desired
