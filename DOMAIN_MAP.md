# DOMAIN_MAP.md — Domain Ownership

> Last updated: 2026-04-28
> Check this BEFORE editing cross-domain code. Multi-domain task → propose plan first.

| Domain | Tables | Routes | Services | Key types |
|--------|--------|--------|----------|-----------|
| **Auth** | `admin_users`, `admin_sessions`, `admin_login_history` | `/api/auth/*` | `authService`, `tokenService` | `UserDTO` |
| **Product** | `products`, `product_details` (legacy: `dev_toolkits`, `dev_toolkit_*`) | `/api/products/*`, `/api/categories/*` | `productService`, `categoryService` | `ProductDTO`, `CategoryDTO` |
| **Banner** | `banners` | `/api/banners/*` | `bannerService` | `BannerDTO` |
| **HomeSettings** | `home_settings` | `/api/settings/home-sections` (raw SQL), `/api/home-settings` (CQRS) | `settingsService`, `homeSettingsService` | — |

**Rules**:
- Do NOT modify another domain's tables/services from outside that domain
- Product domain renames (legacy `dev_toolkit*` → `product*`) require full-layer update + migration
