# Admin Authentication System

## Overview
Enterprise-grade authentication system for admin users built with Go (Backend) and Next.js (Frontend). Implements comprehensive security measures including JWT tokens, bcrypt password hashing, rate limiting, account locking, and session management. Provides secure login, token refresh, password management, and audit logging capabilities.

## Why

**Business Requirements**:
- Secure admin access control to protect sensitive operations
- Multi-session management for admins working across devices
- Audit trail for compliance and security monitoring
- Force password change on first login for security
- Account lockout mechanism to prevent brute force attacks
- Session tracking and revocation capabilities

**Technical Reasoning**:
- **JWT with Refresh Tokens**: Chosen for stateless auth with short-lived access tokens (15 min) and longer refresh tokens (7 days) stored in HTTP-only cookies to prevent XSS attacks
- **bcrypt (cost factor 12)**: Industry-standard password hashing with sufficient computational cost to resist brute force
- **Rate Limiting**: Prevents abuse with 5 login attempts per 15 minutes per IP
- **Account Locking**: Automatically locks after 5 failed attempts for 15 minutes
- **Hexagonal Architecture**: Separates business logic from infrastructure for maintainability and testability

**Alternatives Considered**:
- OAuth2/OpenID Connect: Too complex for internal admin system
- Session-based auth: Stateful, harder to scale horizontally
- Argon2 password hashing: bcrypt is more widely supported and sufficient for our use case

## How

**Architecture**:
```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Next.js Admin  │────────▶│   Go Backend     │────────▶│   PostgreSQL    │
│   (Frontend)    │◀────────│  (Hexagonal)     │◀────────│   (Database)    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
       │                             │
       │                             │
   AuthContext              ┌────────┴─────────┐
   (State Mgmt)             │  Domain Layer    │
                            │  - User Entity   │
                            │  - Auth Service  │
                            │  - Security Util │
                            └──────────────────┘
```

**Components Involved**:
- **Backend (Go)**:
  - `internal/core/domain/auth/` - Domain layer with business logic
  - `internal/infrastructure/adapter/http/handler/` - HTTP request handlers
  - `internal/infrastructure/adapter/http/middleware/` - Auth, rate limiting, security headers
  - `internal/infrastructure/adapter/persistence/` - Database repositories
- **Frontend (Next.js)**:
  - `app/admin/auth/` - Login and password change pages
  - `contexts/AuthContext.tsx` - Global auth state management
  - `components/admin/AdminAuthMiddleware.tsx` - Protected route wrapper

**Data Flow**:
1. User submits credentials → Login handler
2. Service validates password (bcrypt compare) → Checks account lock status
3. Generate JWT access token + refresh token → Store refresh token in DB (hashed)
4. Return tokens to client → Store refresh token in HTTP-only cookie
5. Client uses access token in Authorization header for subsequent requests
6. Middleware validates JWT → Checks expiration → Allows/denies access
7. On token expiry, client uses refresh token → Get new access token
8. All login attempts logged to `admin_login_history` with IP tracking

**Implementation Details**:
- **Password Validation**: Min 8 chars, uppercase, lowercase, number, special char
- **JWT Claims**: user_id, username, role, exp (expiration)
- **Session Limit**: Max 5 concurrent sessions per user
- **Rate Limiting**: In-memory store (consider Redis for production)
- **Security Headers**: X-Frame-Options, CSP, HSTS, X-Content-Type-Options

**Patterns Used**:
- Repository Pattern for data access abstraction
- Middleware Pattern for cross-cutting concerns (auth, logging, CORS)
- Service Layer for business logic
- DTO Pattern for request/response transformation

## Code Examples

### Example 1: Login Handler (Backend)
```go
// apps/backend-go/internal/infrastructure/adapter/http/handler/auth.go
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
    var req request.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "Invalid request")
        return
    }

    // Authenticate user
    result, err := h.service.Login(r.Context(), req.Username, req.Password, r.RemoteAddr, r.UserAgent())
    if err != nil {
        response.Error(w, http.StatusUnauthorized, err.Error())
        return
    }

    // Set refresh token in HTTP-only cookie
    http.SetCookie(w, &http.Cookie{
        Name:     "refresh_token",
        Value:    result.RefreshToken,
        HttpOnly: true,
        Secure:   true, // HTTPS only in production
        SameSite: http.SameSiteStrictMode,
        MaxAge:   7 * 24 * 3600, // 7 days
        Path:     "/api/auth",
    })

    response.Success(w, result)
}
```

### Example 2: JWT Middleware (Backend)
```go
// apps/backend-go/internal/infrastructure/adapter/http/middleware/auth.go
func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := m.service.ValidateAccessToken(tokenString)
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        // Add user info to context
        ctx := context.WithValue(r.Context(), "user_id", claims.UserID)
        ctx = context.WithValue(ctx, "username", claims.Username)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### Example 3: Auth Context (Frontend)
```typescript
// apps/web/src/contexts/AuthContext.tsx
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    
    setUser(data.user);
    localStorage.setItem('access_token', data.access_token);
    return data;
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
      credentials: 'include',
    });
    setUser(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Example 4: Protected Route
```typescript
// apps/web/src/components/admin/AdminAuthMiddleware.tsx
export function AdminAuthMiddleware({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/auth/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  // Force password change on first login
  if (user.must_change_password && !router.pathname.includes('change-password')) {
    router.push('/admin/auth/change-password');
    return null;
  }

  return <>{children}</>;
}
```

### Example 5: Password Validation
```go
// apps/backend-go/internal/core/domain/auth/security.go
func ValidatePasswordStrength(password string) error {
    if len(password) < 8 {
        return errors.New("password must be at least 8 characters")
    }
    
    var (
        hasUpper   = regexp.MustCompile(`[A-Z]`).MatchString(password)
        hasLower   = regexp.MustCompile(`[a-z]`).MatchString(password)
        hasNumber  = regexp.MustCompile(`[0-9]`).MatchString(password)
        hasSpecial = regexp.MustCompile(`[!@#$%^&*]`).MatchString(password)
    )
    
    if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
        return errors.New("password must contain uppercase, lowercase, number, and special character")
    }
    
    return nil
}

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12) // cost factor 12
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

## Dependencies

### Internal Dependencies
- `apps/backend-go/internal/config` - Configuration management
- `apps/backend-go/pkg/logger` - Structured logging
- `apps/backend-go/pkg/errors` - Custom error types
- `apps/web/src/contexts/AuthContext.tsx` - Frontend auth state

### External Dependencies

**Backend (Go)**:
- `golang.org/x/crypto/bcrypt` - Password hashing
- `github.com/golang-jwt/jwt/v5` - JWT generation and validation
- `github.com/lib/pq` - PostgreSQL driver
- `database/sql` - Standard database interface

**Frontend (Next.js)**:
- `next@14+` - React framework with App Router
- `react@18+` - UI library
- `typescript@5+` - Type safety

## API Endpoints

### POST /api/auth/login
**Purpose**: Authenticate user and return tokens  
**Rate Limit**: 5 requests per 15 minutes per IP  
**Request**: 
```typescript
interface LoginRequest {
  username: string;
  password: string;
}
```
**Response**:
```typescript
interface LoginResponse {
  access_token: string;
  refresh_token: string; // Also set in HTTP-only cookie
  token_type: "Bearer";
  expires_in: number; // Seconds (900 = 15 min)
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: "super_admin" | "admin";
    must_change_password: boolean;
  };
}
```

### POST /api/auth/refresh
**Purpose**: Refresh expired access token  
**Request**: 
```typescript
interface RefreshRequest {
  refresh_token: string; // From cookie or body
}
```
**Response**: Same as login (new tokens)

### GET /api/auth/me
**Purpose**: Get current user info  
**Auth**: Required (Bearer token)  
**Response**:
```typescript
interface MeResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}
```

### POST /api/auth/logout
**Purpose**: Revoke current session  
**Auth**: Required  
**Response**: `{ "success": true }`

### POST /api/auth/change-password
**Purpose**: Change user password  
**Auth**: Required  
**Request**:
```typescript
interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
```

### GET /api/auth/sessions
**Purpose**: List active sessions for current user  
**Auth**: Required  
**Response**:
```typescript
interface Session {
  id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  last_used_at: string;
  expires_at: string;
}
```

### GET /api/auth/login-history
**Purpose**: Audit log of login attempts  
**Auth**: Required  
**Query Params**: `?limit=50&offset=0`  
**Response**:
```typescript
interface LoginHistory {
  id: number;
  username: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  reason?: string; // If failed
  created_at: string;
}
```

## Database Schema

```sql
-- Admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Active sessions table
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Login history (audit log)
CREATE TABLE admin_login_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES admin_users(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_login_history_user_id ON admin_login_history(user_id);
CREATE INDEX idx_admin_login_history_created_at ON admin_login_history(created_at DESC);

-- Password reset tokens (future use)
CREATE TABLE admin_password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_password_reset_tokens_user_id ON admin_password_reset_tokens(user_id);
```

## Configuration

**Environment Variables**:
- `DATABASE_URL` - PostgreSQL connection string (required)
- `JWT_SECRET` - Secret key for JWT signing (required, min 32 chars recommended)
- `JWT_ACCESS_TOKEN_DURATION` - Access token lifetime (default: 15m)
- `JWT_REFRESH_TOKEN_DURATION` - Refresh token lifetime (default: 168h = 7 days)
- `CORS_ALLOWED_ORIGINS` - Comma-separated frontend URLs (default: http://localhost:3000)
- `MAX_LOGIN_ATTEMPTS` - Failed attempts before lock (default: 5)
- `ACCOUNT_LOCK_DURATION` - Lock duration in minutes (default: 15)
- `MAX_SESSIONS_PER_USER` - Concurrent session limit (default: 5)

**Settings**:
- Location: `apps/backend-go/internal/config/config.go`
- Loads from environment variables
- Validates required settings on startup

**Default Admin Account**:
```
Username: superadmin
Password: Admin123!@#
Email: admin@localhost.local
Role: super_admin
Must Change Password: true
```

## Testing

**Unit Tests**: 
- Location: `apps/backend-go/internal/core/domain/auth/*_test.go`
- Coverage: Password validation, JWT generation/validation, bcrypt hashing
- Run: `go test ./internal/core/domain/auth/...`

**Integration Tests**: 
- Location: `apps/backend-go/internal/infrastructure/adapter/http/handler/auth_test.go`
- Scenarios: Login flow, token refresh, password change, rate limiting, account locking
- Run: `go test -tags=integration ./internal/infrastructure/...`

**Manual Testing Steps**:
1. Start backend: `cd apps/backend-go && go run cmd/server/main.go`
2. Start frontend: `cd apps/web && npm run dev`
3. Navigate to http://localhost:3000/admin/auth/login
4. Login with default credentials (superadmin / Admin123!@#)
5. Verify forced password change redirect
6. Change password and verify new credentials work
7. Test logout and re-login
8. Test invalid credentials (verify account locks after 5 attempts)
9. Test token expiration (wait 15 min or manipulate token)

**API Testing with cURL**:
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"NewPass123!@#"}' \
  | jq -r '.access_token')

# Get user info
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Change password
curl -X POST http://localhost:8080/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"current_password":"NewPass123!@#","new_password":"AnotherPass456!@#"}'
```

## Notes

### Important Considerations

**Security Implications**:
- **Never log passwords or tokens** - Ensure logger filters sensitive data
- **HTTPS required in production** - HTTP-only cookies need secure transport
- **JWT secret rotation** - Plan for key rotation strategy (not currently implemented)
- **Session cleanup** - Implement cron job to delete expired sessions from DB
- **Rate limiting storage** - Current in-memory implementation won't work across multiple instances; use Redis for production

**Performance Characteristics**:
- bcrypt cost factor 12: ~200ms per hash on modern CPU (acceptable for login flow)
- JWT validation: <1ms (no database lookup needed)
- Database queries: Indexed lookups on username/email are fast
- Rate limiter: O(1) lookup in memory map (consider Redis for distributed systems)

**Edge Cases Handled**:
- Concurrent login attempts during account lock
- Token refresh with expired refresh token
- Multiple device sessions (up to 5)
- Password change while other sessions active (all sessions remain valid)
- Database connection failures (proper error handling and retries)

### Known Issues
- **Rate limiter not distributed**: In-memory rate limiting won't work across multiple backend instances. Requires Redis integration for horizontal scaling.
- **No password history**: Users can reuse old passwords. Consider adding password history table.
- **No 2FA**: Two-factor authentication not implemented. High-priority for production.
- **Session revocation delay**: Logged-out sessions remain in DB until cleanup. Add background job.
- **No email notifications**: Account lockout and password changes don't trigger email alerts.

### Future Enhancements
- [ ] Two-Factor Authentication (TOTP/SMS)
- [ ] Password reset via email with secure tokens
- [ ] Redis for distributed rate limiting and session store
- [ ] Audit log export (CSV/JSON) for compliance
- [ ] Role-based access control (RBAC) with granular permissions
- [ ] IP whitelist/blacklist for admin access
- [ ] CAPTCHA integration for brute force protection
- [ ] Passwordless authentication (magic links, WebAuthn)

---

**Created**: 2024-01-15  
**Last Updated**: 2026-02-03  
**Author**: DevOps Team  
**Status**: Production-ready (with known limitations noted above)
