# Project Guidelines

## Build and Test
- Work from the `nuxt-app/` directory for install, dev, lint, build, and DB commands.
- Install dependencies: `npm install`
- Full local dev (Nuxt + local Turso): `npm run dev`
- Local DB only: `npm run dev:db`
- Lint: `npm run lint`
- Lint with fixes: `npm run lint:fix`
- Build: `npm run build`
- Preview production build: `npm run preview`
- Generate static output: `npm run generate`
- Seed local DB: `npm run db:seed`
- Seed production DB: `npm run db:seed:prod`
- Run production migrations: `npm run db:migrate:prod`

## Architecture
- This is a Nuxt 4 full-stack app using Nitro server routes and Drizzle ORM with Turso.
- Frontend pages/components live under `nuxt-app/app/`.
- Server API handlers are file-routed in `nuxt-app/server/api/` using `{name}.{method}.ts` naming.
- DB schemas live in `nuxt-app/app/lib/db/schemas/` and are exported by `nuxt-app/app/lib/db/schemas/index.ts`.
- Auth uses Better Auth:
  - Server handler: `nuxt-app/server/api/auth/[...].ts`
  - Client plugin: `nuxt-app/app/plugins/auth-client.ts`
- A Nitro scheduled task (`cleanPendingReservations`) runs every 15 minutes.

## Conventions
- Keep feature page directories case-sensitive and consistent with current routes (for example: `Login`, `Register`, `Rooms`, `dashboard`).
- Follow current page/component naming patterns already used in the app (for example `Main*View.vue`, `*Form.vue`, `*List*.vue`, `*Item*.vue`).
- Keep API handlers small and explicit: parse input, validate auth/session, execute DB operation, return clear status/message.
- Preserve Drizzle conventions already configured in `drizzle.config.ts` (schema index + camelCase casing).

## Pitfalls
- Env vars are validated at runtime via Zod in `nuxt-app/app/lib/env.ts`; missing values fail early.
- Required env keys include: `NODE_ENV`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- In development, Turso auth token can be omitted (see `drizzle.config.ts` logic); in production it is required.
- `/dashboard` server middleware auth protection is path-based in `nuxt-app/server/middleware/checkAuth.ts`; new protected server routes may need explicit session checks.
- Reservation cleanup is asynchronous and scheduled every 15 minutes, while timeout logic is 5 minutes in task code; do not assume immediate cleanup.

## References
- Project overview and roadmap: `README.md`
- App-level setup/stack summary: `nuxt-app/README.md`
