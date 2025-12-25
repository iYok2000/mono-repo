package auth

import (
	"time"
)

// AdminUser represents an admin user in the system
type AdminUser struct {
	ID                  int        `json:"id" db:"id"`
	Username            string     `json:"username" db:"username"`
	Email               string     `json:"email" db:"email"`
	PasswordHash        string     `json:"-" db:"password_hash"` // Never expose in JSON
	FullName            string     `json:"full_name" db:"full_name"`
	Role                string     `json:"role" db:"role"`
	IsActive            bool       `json:"is_active" db:"is_active"`
	MustChangePassword  bool       `json:"must_change_password" db:"must_change_password"`
	FailedLoginAttempts int        `json:"-" db:"failed_login_attempts"`
	LockedUntil         *time.Time `json:"-" db:"locked_until"`
	LastLoginAt         *time.Time `json:"last_login_at" db:"last_login_at"`
	LastLoginIP         *string    `json:"last_login_ip" db:"last_login_ip"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at" db:"updated_at"`
}

// AdminSession represents an active admin session
type AdminSession struct {
	ID               int        `json:"id" db:"id"`
	AdminUserID      int        `json:"admin_user_id" db:"admin_user_id"`
	RefreshTokenHash string     `json:"-" db:"refresh_token_hash"`
	AccessTokenJTI   string     `json:"access_token_jti" db:"access_token_jti"`
	IPAddress        string     `json:"ip_address" db:"ip_address"`
	UserAgent        string     `json:"user_agent" db:"user_agent"`
	ExpiresAt        time.Time  `json:"expires_at" db:"expires_at"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	LastActivityAt   time.Time  `json:"last_activity_at" db:"last_activity_at"`
	IsRevoked        bool       `json:"is_revoked" db:"is_revoked"`
	RevokedAt        *time.Time `json:"revoked_at" db:"revoked_at"`
	RevokedReason    *string    `json:"revoked_reason" db:"revoked_reason"`
}

// AdminLoginHistory represents a login attempt record
type AdminLoginHistory struct {
	ID            int       `json:"id" db:"id"`
	AdminUserID   *int      `json:"admin_user_id" db:"admin_user_id"`
	Username      string    `json:"username" db:"username"`
	IPAddress     string    `json:"ip_address" db:"ip_address"`
	UserAgent     string    `json:"user_agent" db:"user_agent"`
	LoginStatus   string    `json:"login_status" db:"login_status"`
	FailureReason *string   `json:"failure_reason" db:"failure_reason"`
	CreatedAt     time.Time `json:"created_at" db:"created_at"`
}

// LoginStatus constants
const (
	LoginStatusSuccess        = "success"
	LoginStatusFailedPassword = "failed_password"
	LoginStatusFailedLocked   = "failed_locked"
	LoginStatusFailedInactive = "failed_inactive"
)

// Role constants
const (
	RoleAdmin      = "admin"
	RoleSuperAdmin = "super_admin"
)

// IsLocked checks if the account is currently locked
func (u *AdminUser) IsLocked() bool {
	if u.LockedUntil == nil {
		return false
	}
	return time.Now().Before(*u.LockedUntil)
}

// CanLogin checks if user can attempt login
func (u *AdminUser) CanLogin() (bool, string) {
	if !u.IsActive {
		return false, "Account is inactive"
	}
	if u.IsLocked() {
		return false, "Account is temporarily locked due to multiple failed login attempts"
	}
	return true, ""
}
