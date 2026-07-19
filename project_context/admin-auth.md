# Admin Authentication

> Last updated: 2026-07-19

## What
JWT-based auth for admin panel. Access + refresh token both **10 min** → absolute session ≤ 10 min from login (refresh reuses the same token so it can't extend past the original window). Refresh token in HTTP-only cookie. FE also enforces an absolute 10-min auto-logout. bcrypt (cost 12), rate limiting (5/15min/IP), account lock (5 failures → 15min lock).

Token durations are constants in `internal/core/domain/auth/security.go` (`AccessTokenDuration`, `RefreshTokenDuration` = 10 min), NOT env-driven.

## Where

**Backend**:
- Domain: `internal/core/domain/auth/` — entities, password validation, security utils
- Handlers: `internal/infrastructure/adapter/http/handler/auth.go`
- Middleware: `internal/infrastructure/adapter/http/middleware/` — auth, rate limit, security headers
- Repository: `internal/infrastructure/adapter/persistence/`

**Frontend**:
- Login: `app/admin/auth/login/`, `app/admin/auth/change-password/`
- State: `contexts/AuthContext.tsx` (fetch-based, NOT axios) — holds 10-min absolute session timer (`SESSION_MAX_MS`, `session_expires_at` in sessionStorage) that auto-logs-out on expiry
- HOC: `hoc/withAuthentication.tsx` — wraps admin pages
- Logout button: `components/admin/AdminSidebar.tsx` (calls `useAuth().logout()`)
- 401 hook: `hooks/useUnauthorizedHandler.ts` — listens `auth:unauthorized` event
- Interceptor: `lib/axios/interceptors/response.ts` — dispatches 401 event
- Change-password: on success it refreshes auth and routes to `/admin` (does NOT force a re-login — this avoids a change→login→change loop)

## Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/login` | No | Login (rate limited) |
| POST | `/api/auth/refresh` | Cookie | Refresh token |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/auth/logout` | Yes | Revoke session |
| POST | `/api/auth/change-password` | Yes | Change password |

> Registered routes above are from `routes.go` (Gin handler `auth_gin.go`).
> `GET /api/auth/sessions` and `GET /api/auth/login-history` are implemented in the
> legacy net/http handler (`auth.go`) but are NOT wired into the router — treat as unavailable.

## DB Tables

- `admin_users` — id (SERIAL), username, password_hash, email, role, is_active, must_change_password, failed_login_attempts, locked_until
- `admin_sessions` — id (SERIAL), admin_user_id (FK CASCADE), refresh_token_hash, access_token_jti, ip_address, expires_at, is_revoked
- `admin_login_history` — id (SERIAL), admin_user_id (FK SET NULL), username, ip_address, login_status, failure_reason
- `admin_password_reset_tokens` — id (SERIAL), admin_user_id (FK CASCADE), token_hash, expires_at, used_at

## Key Constraints
- Password: min 8 chars, upper + lower + number + special
- JWT claims: user_id, username, role, exp
- Default admin (seeded in `001_create_admin_users.sql`): `superadmin` / `Admin123!@#`, `must_change_password: false` — prod-style flow, no forced change on first login (change voluntarily via `/admin/auth/change-password`)
- Session capped at 10 min (see `security.go`); reset password/lockout via `cmd/resetpw`
- Config via env: `JWT_SECRET`, `DATABASE_URL` (durations are NOT env-driven)

## Security Note (prod)
Default password `Admin123!@#` is a bcrypt hash committed in the migration — anyone with repo access knows it. For real prod, seed admins from env instead (see Option A discussion) rather than shipping a known credential.

## Patterns
- Repository pattern, Middleware pattern, Service layer, DTO pattern
- FE: `withAuthentication` HOC + `useUnauthorizedHandler` hook
- Refresh token stored hashed in DB, sent via HTTP-only secure cookie
