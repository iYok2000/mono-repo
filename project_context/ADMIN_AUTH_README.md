# Admin Authentication

> Last updated: 2026-04-28

## What
JWT-based auth for admin panel. Access token (15min) + refresh token (7d, HTTP-only cookie). bcrypt (cost 12), rate limiting (5/15min/IP), account lock (5 failures → 15min lock), max 5 sessions.

## Where

**Backend**:
- Domain: `internal/core/domain/auth/` — entities, password validation, security utils
- Handlers: `internal/infrastructure/adapter/http/handler/auth.go`
- Middleware: `internal/infrastructure/adapter/http/middleware/` — auth, rate limit, security headers
- Repository: `internal/infrastructure/adapter/persistence/`

**Frontend**:
- Login: `app/admin/auth/login/`, `app/admin/auth/change-password/`
- State: `contexts/AuthContext.tsx` (fetch-based, NOT axios)
- HOC: `hoc/withAuthentication.tsx` — wraps admin pages
- 401 hook: `hooks/useUnauthorizedHandler.ts` — listens `auth:unauthorized` event
- Interceptor: `lib/axios/interceptors/response.ts` — dispatches 401 event

## Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/login` | No | Login (rate limited) |
| POST | `/api/auth/refresh` | Cookie | Refresh token |
| GET | `/api/auth/me` | Yes | Current user |
| POST | `/api/auth/logout` | Yes | Revoke session |
| POST | `/api/auth/change-password` | Yes | Change password |
| GET | `/api/auth/sessions` | Yes | List active sessions |
| GET | `/api/auth/login-history` | Yes | Audit log |

## DB Tables

- `admin_users` — id, username, password_hash, email, role, is_active, must_change_password, failed_login_attempts, locked_until
- `admin_sessions` — id (UUID), user_id (FK CASCADE), refresh_token_hash, ip, expires_at
- `admin_login_history` — id, user_id (FK SET NULL), username, ip, success, failure_reason

## Key Constraints
- Password: min 8 chars, upper + lower + number + special
- JWT claims: user_id, username, role, exp
- Default admin: `superadmin` / `Admin123!@#` (must_change_password: true)
- Config via env: `JWT_SECRET`, `JWT_ACCESS_TOKEN_DURATION`, `DATABASE_URL`

## Patterns
- Repository pattern, Middleware pattern, Service layer, DTO pattern
- FE: `withAuthentication` HOC + `useUnauthorizedHandler` hook
- Refresh token stored hashed in DB, sent via HTTP-only secure cookie
