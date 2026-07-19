# Next.js Setup

> Last updated: 2026-04-28

## What
Next.js 16 frontend with App Router, TypeScript, Tailwind CSS v4, Turbopack.

> Package names, ports, and workspace config → see `PROJECT_CONTEXT.md` / `DEVELOPMENT.md`.

## Config (FE-specific)
- Import alias: `@/*` → `src/*`
- Bundler: Turbopack (`pnpm dev`)

## Structure
```
apps/web/src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Landing page
├── globals.css         # Global styles + Tailwind
├── admin/              # Admin pages (auth-protected)
├── card/[data]/        # Business card display
├── create/             # Card creation
├── product/            # Public product pages
└── project/            # Project pages
```

## Key Deps
- next@16, react@19, typescript@5
- tailwindcss v4, postcss
- @mono-repo/shared-types (workspace)

## Shared Types (`@mono-repo/shared-types`)
Workspace package (`packages/shared-types/src/index.ts`). Exports: `HealthCheck`, `ApiResponse<T>`, `User`, `Product`.
Currently used only by `services/healthService.ts` (`HealthCheck`, `ApiResponse`). Most FE types live locally in `apps/web/src/types/` instead.

## Notes
- RSC by default; use `'use client'` for interactive components
- API calls use `goApi` axios instance; base from `NEXT_PUBLIC_GO_API_URL` (fallback `:9000` in `lib/axios/config.ts` — backend actually runs on `:8080`, so set the env var)
- Auth state via `AuthContext` (fetch-based), protected by `withAuthentication` HOC
