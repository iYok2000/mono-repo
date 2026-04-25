# DOMAIN_MAP.md — Domain Ownership

Use this to identify ownership BEFORE editing any code.

If a task touches more than one domain → STOP and propose a plan first.

---

## Auth Domain

Owns authentication and user session logic.

* Tables: `users`, `roles`, `sessions`
* Routes: `/api/auth/*`
* Services: `authService`, `tokenService`
* Types: `UserDTO`

❗ Do NOT modify from other domains.

---

## Product Domain (formerly DevToolkit)

Owns product and category management.

* Tables: `products`, `product_details`

  * Legacy: `dev_toolkits`, `dev_toolkit_details`, `dev_toolkit_categories`
* Routes: `/api/products/*`, `/api/categories/*`
* Services: `productService`, `categoryService`
* Types: `ProductDTO`, `ProductDetailDTO`, `CategoryDTO`

❗ Renames here require full-layer update + migration.

---

## Banner Domain

Owns banner display and management.

* Tables: `banners`
* Routes: `/api/banners/*`
* Services: `bannerService`

---

## HomeSettings Domain

Owns home configuration and versioning.

* Tables: `home_settings`, `home_settings_versions`
* Routes: `/api/homesettings/*`
* Services: `homeSettingsService`

---

## Coupon Domain

Owns coupon and redemption logic.

* Tables: `coupons`, `redemptions`
* Routes: `/api/coupons/*`
* Services: `couponService`
