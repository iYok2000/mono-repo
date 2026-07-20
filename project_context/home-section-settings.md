# Home Section Settings

> Last updated: 2026-07-19

## What
Manage the landing page from the admin UI without redeploying — both **section visibility** (show/hide) and **section content** (titles, subtitles, features, steps, occasions, SKU cards, preview image, SEO meta).

Landing components render ONLY fields that are editable from the admin panel — hardcoded content/icons that couldn't be edited were removed (SKU comparison table, extra WhyUs reasons, Preview example cards, decorative icons in WhatIsIt/WhyNFC/WhyUs/HowItWorks). Occasions keep icons because `occasion_N_icon` IS admin-editable.

## Sections
hero, what_is_it, sku, how_it_works, occasions, why_nfc, why_us, preview, faq, final_cta

Notable content fields:
- `hero`: `badge_text`, `badge_icon`, `title_highlight`, `title_rest`, `subtitle`, `feature_1..3`, `cta_primary/secondary/tertiary` (rendered by `HeroSection`)
  - Layout is 2-column (text + "Byte" mascot). Exception to the "no decorative icons" rule above: `HeroSection` has a **fixed, non-admin-editable** leading `Sparkles` icon on the heading and an `ArrowRightCircle` icon on the primary CTA (styling only — not backed by any `home_settings` field).
- `how_it_works`: 3 steps (`step_1..3_title/description`) — landing renders exactly these
- `preview`: `title`, `subtitle`, `description`, **`image`** (product-style card; falls back to `/mock/preview-card.svg`)
- `sku`: Express/Squad/Greeting card content; `why_us`/`why_nfc`/`what_is_it`: 3–4 feature/benefit title+desc

## Where

**Backend** — ⚠️ TWO parallel systems on the same `home_settings` table:
1. `settings_handler.go` — raw `*sql.DB`, reads/writes `*_enabled BOOL` columns. Routes: `/api/settings/home-sections`. (This is what the landing page uses.)
2. `homesettings/` CQRS (command/query/dto/mapper) + GORM model `homesettings/model/homesettings_model.go`. Routes: `/api/home-settings`. Richer settings model. Seeded via `apps/web/scripts/initHomeSettings.ts`.
- DB: `home_settings` — single row (id='default'), wide/denormalized: per section `*_enabled BOOL` + `*_order` + content columns (e.g. `preview_image`, `sku_express_*`, `why_us_feature_*`). Adding a content field = additive column via GORM AutoMigrate.
- Migration: GORM AutoMigrate in `homesettings/migration.go` (002 SQL file is no-op placeholder)

**Frontend**:
- Services: `services/settingsService.ts` (visibility: `getHomeSections`/`updateHomeSections`), `services/homeSettings/homeSettingsService.ts` (full content: `getHomeSettings`/`updateHomeSettings`)
- Types: `types/homeSettings.ts` (per-section settings interfaces)
- Landing: `app/page.tsx` — renders each section per `sections[key]` visibility + passes `homeSettings?.<key>` content
- Admin (visibility toggle): `app/admin/page.tsx` — on/off switches per section
- Admin (content editor): `app/admin/home-settings/page.tsx` + `components/admin/homeSettings/` (SectionEditor, ContentField, renderFields) — edit every field incl. Preview image, SEO/OG meta

## Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/api/settings/home-sections` | No | Get visibility (public + admin) — raw SQL handler |
| PUT | `/api/settings/home-sections` | Yes | Update visibility (admin only) — raw SQL handler |
| GET | `/api/home-settings` | No | Get settings — CQRS handler |
| PUT | `/api/home-settings` | Yes | Update settings — CQRS handler |

## Response Format
```json
{ "sections": { "hero": true, "what_is_it": true, "sku": false, ... } }
```
