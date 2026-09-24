# AGENTS.md — backend (NestJS + Prisma 8)

## Project overview

NestJS 12 API (`type: module`, ESM) with TypeScript 6 (target ES2023, `strict: true`).
Source root: `src/`. Global route prefix: `api/v1`. Swagger UI served at `api/v1`.
Security baseline: `helmet()`, CORS enabled, global `ThrottlerGuard` (10 req / 60s),
global `ValidationPipe` (`whitelist: true`, `transform: true`).
Config via `@nestjs/config` (`isGlobal: true`) + Joi validation in
`src/config/env.validation.ts`. Observability via `@nestjs/observe`
(`serviceId: 'backend'`, requires `OBSERVE_APP_KEY` / `OBSERVE_APP_SECRET`).

Data layer is **Prisma 8 (contract-first, NOT Prisma 7)**:
`src/prisma/contract.prisma` → generated `contract.json` + `contract.d.ts` →
runtime in `src/prisma/db.ts` via `postgres<Contract>({ contractJson, url })`.
Prisma config: `prisma.config.ts` (`definePrismaConfig` + `ormConfig`).

Tests use **Vitest, not Jest**. Lint is **oxlint**, format is **Prettier**
(`singleQuote`, `trailingComma: all`).

## Installed agent skills (project scope, `.agents/skills/`)

Consult these before writing/reviewing code — skill references win over general knowledge:

- `nestjs-best-practices/SKILL.md` — modules, DI, error handling, security, perf, testing
- `typescript-clean-code/SKILL.md` — smell catalog, review posture, refactoring/TDD workflows
- `code-review-analysis/SKILL.md` — code review findings
- `ponytail/SKILL.md` — adversarial/critical review lens
- `grill-me/SKILL.md` — challenge assumptions, grill designs before implementing
- `prisma-8/SKILL.md` — source of truth for Prisma 8 (check `metadata.library_version`
  vs installed `@prisma/orm-postgres`; if mismatched run `prisma skills sync` and re-read)
- `prisma-composer-core-concepts/`, `prisma-platform-core-concepts/` — Composer/Platform ops

For any Prisma 8 task, open the reference file from the routing table in
`prisma-8/SKILL.md` (contract, migrations, queries, runtime, debug) — do not
answer from memory.

## Commands

```bash
npm install            # postinstall runs `prisma skills sync`
npm run start:dev      # watch mode
npm run start:debug    # watch + debug
npm run build          # nest build -> dist/
npm run start:prod     # node dist/main
npm run lint           # oxlint src/ test/
npm run format         # prettier --write src/**/*.ts test/**/*.ts
npm run test           # vitest run (**/*.spec.ts)
npm run test:watch     # vitest
npm run test:cov       # vitest run --coverage
npm run test:e2e       # vitest --config vitest.config.e2e.ts (**/*.e2e-spec.ts)
npm run contract:emit  # prisma contract emit (after editing contract.prisma)
```

## Environment

Copy `.env.example` to `.env`. Required vars (see `src/config/env.validation.ts`):

- `DATABASE_URL` — Postgres connection string
- `PORT` — default 3000
- `OBSERVE_APP_KEY`, `OBSERVE_APP_SECRET` — required at boot (no defaults)

`ConfigService.get<number>('PORT') ?? 3000` is the fallback in `main.ts`.

## Critical conventions (do not break)

1. **ESM `.js` import suffixes are mandatory.** `moduleResolution: bundler`,
   `module: preserve`. Intra-`src` imports must use `.js`:
   `./app.module.js`, `./app.controller.js` — never strip them.
2. **Prisma 8 contract-first flow.** Edit ONLY `src/prisma/contract.prisma`
   (or a `contract.ts` builder). Then run `npm run contract:emit` to regenerate
   `contract.json` / `contract.d.ts`. Never hand-edit generated artefacts.
   Import runtime from `@prisma/orm-postgres/runtime` in app code
   (`@internal/*` paths in skill refs map to `@prisma/orm-*` in user code).
3. **DTOs + validation.** Every input gets a DTO with `class-validator` decorators;
   output serialization via `class-transformer`. Global pipe already strips unknown
   props (`whitelist`) — do not disable it.
4. **NestJS patterns.** Feature modules (not layer folders); constructor injection
   (no service locator / property injection); repository pattern for DB access;
   `HttpException` family + exception filters (no raw `throw new Error()` to clients);
   Guards for auth, `ThrottlerGuard` is already global; avoid circular module deps
   (`forwardRef` is a smell — restructure first).
   Auth seam: `src/auth/` holds `@Public()`, `@Roles('Admin'|'Operator'|'Customer')`
   and `RolesGuard` (deny-by-default, reads `request.user.role`). Since the
   auth feature, `JwtAuthGuard` + `RolesGuard` are registered globally as
   `APP_GUARD` (authenticate first, then authorize): every non-`@Public()`
   route requires a valid JWT, `@Roles()` routes additionally require the
   role. DB roles are lowercase; the app vocabulary is PascalCase — the
   mapping lives in `src/auth/authenticated-user.ts` (`toUserRole`).
5. **TypeScript strictness.** `strict: true`, `strictPropertyInitialization: false`.
   No `any` leakage, no unchecked `as` casts (validate at boundaries), exhaustive
   switches over discriminated unions, `no-floating-promises` is `warn` — always
   `await` or `void` promises explicitly.
6. **Tests.** Unit: co-located `*.spec.ts` via `@nestjs/testing` (`Test.createTestingModule`),
   mock externals. E2E: `test/*.e2e-spec.ts` via Supertest against the full app
   (global prefix/pipes/guards apply). Update/add tests with every behavior change.
7. **No secrets in git.** `.env` is gitignored; only `.env.example` is committed.

## Definition of done

1. `npm run contract:emit` (if contract changed) + `npm run lint` + `npm run test`
   (+ `npm run test:e2e` for API changes) all green.
2. New/changed behavior covered by spec or e2e test.
3. Prettier formatting applied; no new oxlint warnings.
4. Swagger decorators (`@ApiTags`, `@ApiResponse`, etc.) on new endpoints.
