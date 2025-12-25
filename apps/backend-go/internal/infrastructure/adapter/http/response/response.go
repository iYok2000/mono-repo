package response

import (
	"encoding/json"
	"net/http"
	"time"

	"monorepo/backend-go/internal/core/domain/auth"
)

// Response is a standard API response wrapper
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *Error      `json:"error,omitempty"`
}

// Error represents an API error
type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// LoginResponse represents a successful login response
type LoginResponse struct {
	AccessToken        string         `json:"access_token"`
	RefreshToken       string         `json:"refresh_token"`
	TokenType          string         `json:"token_type"`
	ExpiresIn          int            `json:"expires_in"`
	User               *AdminUserInfo `json:"user"`
	MustChangePassword bool           `json:"must_change_password"`
}

// AdminUserInfo represents safe user information to send to client
type AdminUserInfo struct {
	ID                 int        `json:"id"`
	Username           string     `json:"username"`
	Email              string     `json:"email"`
	FullName           string     `json:"full_name"`
	Role               string     `json:"role"`
	MustChangePassword bool       `json:"must_change_password"`
	LastLoginAt        *time.Time `json:"last_login_at"`
	CreatedAt          time.Time  `json:"created_at"`
}

// SessionInfo represents session information
type SessionInfo struct {
	ID             int       `json:"id"`
	IPAddress      string    `json:"ip_address"`
	UserAgent      string    `json:"user_agent"`
	CreatedAt      time.Time `json:"created_at"`
	LastActivityAt time.Time `json:"last_activity_at"`
	ExpiresAt      time.Time `json:"expires_at"`
}

// LoginHistoryInfo represents login history information
type LoginHistoryInfo struct {
	ID            int       `json:"id"`
	IPAddress     string    `json:"ip_address"`
	UserAgent     string    `json:"user_agent"`
	LoginStatus   string    `json:"login_status"`
	FailureReason *string   `json:"failure_reason,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}

// JSON sends a JSON response
func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := Response{
		Success: statusCode >= 200 && statusCode < 300,
		Data:    data,
	}

	_ = json.NewEncoder(w).Encode(response)
}

// JSONError sends an error response
func JSONError(w http.ResponseWriter, statusCode int, code, message string, details ...string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	errorDetail := ""
	if len(details) > 0 {
		errorDetail = details[0]
	}

	response := Response{
		Success: false,
		Error: &Error{
			Code:    code,
			Message: message,
			Details: errorDetail,
		},
	}

	_ = json.NewEncoder(w).Encode(response)
}

// MapAuthUserToResponse maps auth user to safe response
func MapAuthUserToResponse(user *auth.AdminUser) *AdminUserInfo {
	return &AdminUserInfo{
		ID:                 user.ID,
		Username:           user.Username,
		Email:              user.Email,
		FullName:           user.FullName,
		Role:               user.Role,
		MustChangePassword: user.MustChangePassword,
		LastLoginAt:        user.LastLoginAt,
		CreatedAt:          user.CreatedAt,
	}
}

// MapSessionToResponse maps session to response
func MapSessionToResponse(session *auth.AdminSession) *SessionInfo {
	return &SessionInfo{
		ID:             session.ID,
		IPAddress:      session.IPAddress,
		UserAgent:      session.UserAgent,
		CreatedAt:      session.CreatedAt,
		LastActivityAt: session.LastActivityAt,
		ExpiresAt:      session.ExpiresAt,
	}
}

// MapLoginHistoryToResponse maps login history to response
func MapLoginHistoryToResponse(history *auth.AdminLoginHistory) *LoginHistoryInfo {
	return &LoginHistoryInfo{
		ID:            history.ID,
		IPAddress:     history.IPAddress,
		UserAgent:     history.UserAgent,
		LoginStatus:   history.LoginStatus,
		FailureReason: history.FailureReason,
		CreatedAt:     history.CreatedAt,
	}
}
