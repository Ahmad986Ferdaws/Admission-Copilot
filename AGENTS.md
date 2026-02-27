# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Admission Copilot is a single Next.js 16 application (not a monorepo) for AI-powered university program discovery and application management. It uses Prisma ORM with PostgreSQL for data storage and Google Gemini AI for optional AI features.

### Services

| Service | How to run | Notes |
|---------|-----------|-------|
| PostgreSQL | `sudo service postgresql start` | Must be running before the Next.js dev server. Local dev uses user `devuser`/`devpass` and database `admission_copilot`. |
| Next.js dev server | `npm run dev` | Runs on port 3000. Hot-reloads on file changes. |

### Database setup (one-time after fresh clone)

```bash
sudo service postgresql start
npx prisma migrate dev
npm run db:seed
```

The seed script creates 16 universities, 33 programs, and a mock user (`john.doe@example.com`). Re-running `npm run db:seed` is idempotent (clears and re-seeds).

### Standard commands

See `package.json` scripts and `README.md` for full reference. Key commands:

- **Lint**: `npm run lint` (ESLint; note: the codebase has pre-existing lint errors)
- **Build**: `npm run build` (production build fails due to pre-existing `prisma.config.ts` type error with Prisma 5.22 — does not affect dev server)
- **Dev**: `npm run dev`
- **Seed**: `npm run db:seed`
- **Prisma Studio**: `npx prisma studio` (database GUI on port 5555)

### Non-obvious caveats

- **`prisma.config.ts` build error**: The repo ships a `prisma.config.ts` that imports from `prisma/config`, a module only available in Prisma 6.x. Since the repo pins Prisma 5.22.0, `npm run build` fails on TypeScript checking. The dev server (`npm run dev`) works fine because Turbopack doesn't block on this type error.
- **Authentication is mocked**: No real auth — the app uses a hardcoded mock user. No login credentials are needed.
- **`GEMINI_API_KEY`**: AI features (program explanations, copilot chat) require a valid Google Gemini API key. Without it, the app still works but shows fallback messages ("Unable to generate explanation"). Set it in `.env` if AI features are needed.
- **PostgreSQL must be started manually**: Run `sudo service postgresql start` before launching the dev server. The service does not auto-start in the VM.
