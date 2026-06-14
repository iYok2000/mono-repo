# Next.js Setup

> Last updated: 2026-04-28

## What
Next.js 16 frontend with App Router, TypeScript, Tailwind CSS v4, Turbopack.

## Config
- Package: `@mono-repo/web`
- Shared types: `@mono-repo/shared-types` (workspace:*)
- Dev server: `pnpm dev` → http://localhost:3001
- Import alias: `@/*` → `src/*`

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

## Notes
- RSC by default; use `'use client'` for interactive components
- API calls use `goApi` axios instance (base: localhost:9000)
- Auth state via `AuthContext` (fetch-based), protected by `withAuthentication` HOC
