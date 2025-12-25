# Admin Authentication System

ระบบ Authentication สำหรับ Admin ที่มีความปลอดภัยสูง พัฒนาด้วย Go (Backend) และ Next.js (Frontend)

## 🔐 คุณสมบัติด้านความปลอดภัย

### Backend Security Features
- ✅ **Password Hashing** - ใช้ bcrypt กับ cost factor 12
- ✅ **JWT Tokens** - Access tokens (15 นาที) และ Refresh tokens (7 วัน)
- ✅ **HTTP-Only Cookies** - เก็บ refresh token ใน HTTP-only cookies
- ✅ **Account Locking** - ล็อคบัญชีอัตโนมัติหลัง 5 ครั้งที่ล็อกอินล้มเหลว (15 นาที)
- ✅ **Password Strength Validation** - ต้องมีตัวพิมพ์ใหญ่/เล็ก, ตัวเลข, อักขระพิเศษ
- ✅ **Rate Limiting** - จำกัดการ login 5 ครั้งต่อ 15 นาที
- ✅ **Session Management** - จำกัด 5 sessions ต่อผู้ใช้
- ✅ **Login History** - บันทึกประวัติการเข้าสู่ระบบทั้งหมด
- ✅ **Security Headers** - X-Frame-Options, CSP, HSTS, etc.
- ✅ **CORS Protection** - จำกัด origins ที่อนุญาต
- ✅ **IP Tracking** - บันทึก IP address ทุกการเข้าสู่ระบบ

### Frontend Security Features
- ✅ **Protected Routes** - ป้องกันการเข้าถึงหน้า admin โดยไม่ได้ login
- ✅ **Token Management** - จัดการ access token และ refresh token อัตโนมัติ
- ✅ **Force Password Change** - บังคับเปลี่ยนรหัสผ่านครั้งแรก
- ✅ **Client-side Validation** - ตรวจสอบความถูกต้องก่อนส่ง request
- ✅ **Auto Logout** - ออกจากระบบอัตโนมัติเมื่อ token หมดอายุ

## 📁 โครงสร้างไฟล์

### Backend (Go)
```
apps/backend-go/
├── internal/
│   ├── core/domain/auth/
│   │   ├── admin_user.go        # User model และ business logic
│   │   ├── security.go          # Password hashing, JWT, validation
│   │   ├── repository.go        # Database operations
│   │   └── service.go           # Authentication service
│   ├── infrastructure/adapter/
│   │   ├── http/
│   │   │   ├── handler/auth.go  # HTTP handlers
│   │   │   ├── middleware/
│   │   │   │   ├── auth.go      # JWT verification
│   │   │   │   ├── rate_limiter.go
│   │   │   │   └── security.go  # Security headers
│   │   │   ├── request/auth.go  # Request DTOs
│   │   │   └── response/        # Response DTOs
│   │   └── persistence/
│   │       └── migrations/
│   │           └── 001_create_admin_users.sql
```

### Frontend (Next.js)
```
apps/web/src/
├── app/admin/
│   ├── auth/
│   │   ├── login/page.tsx           # Login page
│   │   └── change-password/page.tsx # Change password page
│   └── layout.tsx                   # Admin layout with auth
├── components/admin/
│   └── AdminAuthMiddleware.tsx      # Route protection
└── contexts/
    └── AuthContext.tsx              # Auth state management
```

## 🗄️ Database Schema

### admin_users
- บันทึกข้อมูลผู้ใช้ admin
- Password hashing ด้วย bcrypt
- Account locking mechanism
- Failed login attempts tracking

### admin_sessions
- จัดการ active sessions
- Refresh token storage (hashed)
- Session expiration และ revocation

### admin_login_history
- Audit log ของการเข้าสู่ระบบทั้งหมด
- บันทึก IP, User-Agent, และสถานะ

### admin_password_reset_tokens
- จัดการ password reset tokens (สำหรับอนาคต)

## 🚀 การติดตั้งและใช้งาน

### 1. ติดตั้ง Database

```bash
# เชื่อมต่อกับ PostgreSQL
psql -U postgres

# สร้าง database
CREATE DATABASE your_database;

# รัน migration
\c your_database
\i apps/backend-go/internal/infrastructure/adapter/persistence/migrations/001_create_admin_users.sql
```

### 2. ติดตั้ง Go Dependencies

```bash
cd apps/backend-go
go mod download

# ติดตั้ง required packages
go get golang.org/x/crypto/bcrypt
go get github.com/golang-jwt/jwt/v5
go get github.com/lib/pq  # PostgreSQL driver
```

### 3. กำหนดค่า Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
# Database
DATABASE_URL=postgres://username:password@localhost:5432/your_database?sslmode=disable

# JWT Secret (สร้าง secret key ที่ปลอดภัย)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
HTTP_PORT=8080
ENVIRONMENT=development
SERVICE_NAME=backend-go

# Frontend URL (สำหรับ CORS)
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Enable Services
ENABLE_HTTP=true
ENABLE_GRPC=false
```

### 4. เพิ่ม JWT Secret ใน Config

แก้ไขไฟล์ `apps/backend-go/internal/config/config.go`:

```go
type Config struct {
    // ... existing fields
    JWTSecret string
}

func Load() *Config {
    return &Config{
        // ... existing fields
        JWTSecret: getEnv("JWT_SECRET", ""),
    }
}
```

### 5. เพิ่ม Routes ใน Backend

สร้าง/แก้ไขไฟล์ `apps/backend-go/internal/infrastructure/adapter/http/routes/routes.go`:

```go
package routes

import (
    "database/sql"
    "net/http"
    
    "monorepo/backend-go/internal/config"
    "monorepo/backend-go/internal/core/domain/auth"
    "monorepo/backend-go/internal/infrastructure/adapter/http/handler"
    "monorepo/backend-go/internal/infrastructure/adapter/http/middleware"
)

func SetupRoutes(db *sql.DB, cfg *config.Config) http.Handler {
    mux := http.NewServeMux()
    
    // Initialize auth repository and service
    authRepo := auth.NewPostgresRepository(db)
    authService := auth.NewService(authRepo, cfg.JWTSecret)
    
    // Initialize handlers
    authHandler := handler.NewAuthHandler(authService)
    
    // Initialize middleware
    authMiddleware := middleware.NewAuthMiddleware(authService)
    loginRateLimiter := middleware.NewLoginRateLimiter()
    apiRateLimiter := middleware.NewAPIRateLimiter()
    
    // Public routes (with login rate limiting)
    mux.Handle("/api/auth/login", loginRateLimiter.Limit(
        http.HandlerFunc(authHandler.Login),
    ))
    mux.Handle("/api/auth/refresh", apiRateLimiter.Limit(
        http.HandlerFunc(authHandler.RefreshToken),
    ))
    
    // Protected routes (require authentication)
    mux.Handle("/api/auth/me", authMiddleware.RequireAuth(
        http.HandlerFunc(authHandler.Me),
    ))
    mux.Handle("/api/auth/logout", authMiddleware.RequireAuth(
        http.HandlerFunc(authHandler.Logout),
    ))
    mux.Handle("/api/auth/change-password", authMiddleware.RequireAuth(
        http.HandlerFunc(authHandler.ChangePassword),
    ))
    mux.Handle("/api/auth/sessions", authMiddleware.RequireAuth(
        http.HandlerFunc(authHandler.GetSessions),
    ))
    mux.Handle("/api/auth/login-history", authMiddleware.RequireAuth(
        http.HandlerFunc(authHandler.GetLoginHistory),
    ))
    
    // Apply security headers and CORS to all routes
    handler := middleware.SecurityHeaders(mux)
    handler = middleware.CORS(cfg.CorsAllowedOrigins)(handler)
    
    return handler
}
```

### 6. ติดตั้ง Frontend Dependencies

```bash
cd apps/web
npm install  # หรือ pnpm install
```

### 7. กำหนดค่า Frontend Environment

สร้างไฟล์ `.env.local` ใน `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 8. รันระบบ

```bash
# Terminal 1: Backend
cd apps/backend-go
go run cmd/server/main.go

# Terminal 2: Frontend
cd apps/web
npm run dev  # หรือ pnpm dev
```

## 🔑 Default Admin Account

```
Username: superadmin
Password: Admin123!@#
```

**⚠️ สำคัญ:** คุณจะถูกบังคับให้เปลี่ยนรหัสผ่านในครั้งแรกที่เข้าสู่ระบบ

## 📝 API Endpoints

### Public Endpoints

#### POST /api/auth/login
เข้าสู่ระบบ

**Request:**
```json
{
  "username": "superadmin",
  "password": "Admin123!@#"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "abc123...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": 1,
      "username": "superadmin",
      "email": "admin@localhost.local",
      "full_name": "Super Administrator",
      "role": "super_admin",
      "must_change_password": true
    },
    "must_change_password": true
  }
}
```

#### POST /api/auth/refresh
Refresh access token

**Request:**
```json
{
  "refresh_token": "abc123..."
}
```

### Protected Endpoints (ต้องใส่ Authorization header)

#### GET /api/auth/me
ดึงข้อมูลผู้ใช้ปัจจุบัน

#### POST /api/auth/logout
ออกจากระบบ

#### POST /api/auth/change-password
เปลี่ยนรหัสผ่าน

**Request:**
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass123!@#"
}
```

#### GET /api/auth/sessions
ดึงรายการ active sessions

#### GET /api/auth/login-history
ดึงประวัติการเข้าสู่ระบบ

## 🔒 ความต้องการของรหัสผ่าน

- ความยาวอย่างน้อย 8 ตัวอักษร
- มีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)
- มีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)
- มีตัวเลขอย่างน้อย 1 ตัว (0-9)
- มีอักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)

## 🛡️ Security Best Practices

### ที่ทำแล้ว ✅
- [x] Password hashing ด้วย bcrypt
- [x] JWT tokens กับ expiration
- [x] HTTP-only cookies สำหรับ refresh tokens
- [x] Rate limiting
- [x] Account locking
- [x] Session management
- [x] Security headers
- [x] CORS protection
- [x] Login history tracking
- [x] IP address logging
- [x] Input validation
- [x] Password strength requirements

### แนะนำเพิ่มเติมสำหรับ Production 🚀
- [ ] HTTPS/TLS encryption (บังคับ)
- [ ] Two-Factor Authentication (2FA)
- [ ] Email notifications สำหรับ suspicious activities
- [ ] Password reset via email
- [ ] CAPTCHA สำหรับ login form
- [ ] Redis สำหรับ rate limiting แทน in-memory
- [ ] Audit logging ใน separate service
- [ ] Database encryption at rest
- [ ] Secrets management (AWS Secrets Manager, HashiCorp Vault)
- [ ] Regular security audits และ penetration testing

## 📊 Monitoring และ Logging

ระบบบันทึกข้อมูลต่อไปนี้:
- Login attempts (สำเร็จ/ล้มเหลว)
- IP addresses
- User agents
- Session creation/revocation
- Password changes
- Account lockouts

## 🧪 Testing

### ทดสอบ Backend API

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"Admin123!@#"}'

# Get user info (ใส่ access_token ที่ได้)
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## 🔧 Troubleshooting

### ปัญหา: Database connection failed
- ตรวจสอบว่า PostgreSQL รันอยู่
- ตรวจสอบ DATABASE_URL ใน .env
- ตรวจสอบว่ารัน migration แล้ว

### ปัญหา: JWT token invalid
- ตรวจสอบว่าตั้ง JWT_SECRET ใน .env
- ตรวจสอบว่า JWT_SECRET ตรงกันระหว่าง backend และ config

### ปัญหา: CORS errors
- ตรวจสอบ CORS_ALLOWED_ORIGINS ใน .env
- ตรวจสอบว่า frontend URL ตรงกับที่กำหนดไว้

### ปัญหา: Account locked
- รอ 15 นาทีจะ unlock อัตโนมัติ
- หรือรัน SQL: `UPDATE admin_users SET failed_login_attempts = 0, locked_until = NULL WHERE username = 'superadmin';`

## 📚 เอกสารเพิ่มเติม

- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt vs other hashing algorithms](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## 📝 License

MIT License

## 👥 Contributors

ระบบนี้พัฒนาโดยทีม DevOps สำหรับการจัดการ Admin ที่ปลอดภัย
