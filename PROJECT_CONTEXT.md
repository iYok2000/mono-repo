# PROJECT_CONTEXT.md — Architecture & Feature Index

> Last updated: 2026-07-20
> For rules and workflow → see `AGENT.md`

---

## Stack

| Layer | Tech | Port |
|-------|------|------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS v4 | 3000 (`next dev` default) |
| Backend HTTP | Go + Gin | 8080 (`HTTP_PORT`, default 8080) |
| Backend gRPC | Go + gRPC | 50051 — disabled by default (`ENABLE_GRPC=false`), greeter demo only |
| Database | PostgreSQL (Docker) | 5432 |
| Monorepo | pnpm workspaces + Turborepo | — |

**Package names**: `@mono-repo/web`, `@mono-repo/backend-go`

> ⚠️ Port inconsistency in FE: some clients default to `:9000` (`lib/axios/config.ts`, `AuthContext.tsx`),
> others to `:8080` (`grpcService.ts`, `config/services.ts`, `scripts/initHomeSettings.ts`).
> Backend actually listens on `HTTP_PORT` (`.env` = 8080). Set `NEXT_PUBLIC_GO_API_URL` to override.

---

## Architecture

```
apps/
  web/            → Next.js 16 App Router (RSC, TypeScript)
  backend-go/     → Go Gin (Hexagonal + CQRS)
packages/
  shared-types/   → Shared TypeScript types (only package present)
```

**Backend pattern**: Hexagonal Architecture + CQRS (Command/Query split)
**Frontend pattern**: App Router, feature-scoped `_components/`, `_hooks/`, `_utils/`
**API**: RESTful (Gin). gRPC is scaffolded (`proto/greeter` demo) but disabled by default
**Auth**: JWT access + refresh token, both 10min (absolute session ≤ 10 min; refresh in HTTP-only cookie)
**Security**: ContentValidator (Go), DOMPurify (FE)

---

## Feature Index

| Feature | Doc | Key paths |
|---------|-----|-----------|
| Admin Auth | [admin-auth](./project_context/admin-auth.md) | `internal/core/domain/auth/`, `contexts/AuthContext.tsx`, `hoc/withAuthentication.tsx` |
| Product Management | [product-management](./project_context/product-management.md) | `internal/application/product/`, `app/admin/product/`, `app/product/` |
| Banner Management | [banner-management](./project_context/banner-management.md) | `internal/application/banner/`, `app/admin/banner/` |
| Home Section Settings | [home-section-settings](./project_context/home-section-settings.md) | `settings_handler.go` + `internal/application/homesettings/`, `app/admin/page.tsx`, `app/admin/home-settings/` |
| Digital Business Card | [business-card](./project_context/business-card.md) | `app/create/greeting/`, `app/card/[data]/` |
| AdReady (AdSense Auditor) | [adready-checker](./project_context/adready-checker.md) | `internal/core/domain/audit/`, `internal/application/audit/`, `app/(audit)/audit/`, `app/services/fix-adsense/`, `app/api/audit/` |
| Utilities | [utils-documentation](./project_context/utils-documentation.md) | `utils/`, `hooks/`, `services/export/` |
| Design Tokens | [design-tokens](./project_context/design-tokens.md) | Tailwind config, `globals.css` |
| UI Components | [components](./project_context/components.md) | `components/ui/`, `components/home/`, `components/admin/` |
| Installation | [installation-guide](./project_context/installation-guide.md) | Root `Makefile`, `pnpm-workspace.yaml` |
| Next.js Setup | [nextjs-setup](./project_context/nextjs-setup.md) | `apps/web/` |

---

## Known Gaps / Not Implemented

> Reflects actual code state (2026-07-19). The landing page markets features that are not built yet — do not assume they exist.

- **Gift creation flows missing**: CTAs to `/create/express` and `/create/squad` (in `SKUSection`, `FinalCTASection`, `LandingSidebar`) are **dead links** — those pages do not exist. Only `/create/greeting` (client-side business card) is implemented.
- **Recipient video-gift viewer not built**: "tap NFC → open video from Google Drive", Squad group-video compilation, etc. exist only in marketing copy, not in code.
- **Dead code removed (2026-07-19)**: unused landing wrappers `FirstSightHero`/`ScrollytellingDemo`, the whole `components/interactive/` set (Byte animations, 3D card, live-scan demo), and the orphan `app/project/` placeholder were deleted.
- **No automated tests** present/documented for FE or BE.
- **gRPC**: scaffold only (`proto/greeter` demo), disabled by default.
