package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"monorepo/backend-go/internal/core/domain/auth"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"
	"monorepo/backend-go/pkg/logger"
)

// AuthHandler handles authentication endpoints
type AuthHandler struct {
	authService *auth.Service
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *auth.Service) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Login handles POST /api/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req request.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.JSONError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body")
		return
	}

	if err := req.Validate(); err != nil {
		response.JSONError(w, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	// Get client IP and User-Agent
	ipAddress := getClientIP(r)
	userAgent := r.UserAgent()

	loginReq := &auth.LoginRequest{
		Username:  req.Username,
		Password:  req.Password,
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}

	loginResp, err := h.authService.Login(r.Context(), loginReq)
	if err != nil {
		logger.Log.Error("Login failed: " + err.Error())

		switch {
		case errors.Is(err, auth.ErrInvalidCredentials):
			response.JSONError(w, http.StatusUnauthorized, "INVALID_CREDENTIALS", "Invalid username or password")
		case errors.Is(err, auth.ErrAccountLocked):
			response.JSONError(w, http.StatusForbidden, "ACCOUNT_LOCKED", "Account is temporarily locked due to too many failed login attempts")
		case errors.Is(err, auth.ErrAccountInactive):
			response.JSONError(w, http.StatusForbidden, "ACCOUNT_INACTIVE", "Account is inactive")
		default:
			response.JSONError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "An error occurred during login")
		}
		return
	}

	// Set refresh token in HTTP-only cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    loginResp.RefreshToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // Set to true in production (HTTPS)
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(auth.RefreshTokenDuration.Seconds()),
	})

	// Return access token and user info
	response.JSON(w, http.StatusOK, response.LoginResponse{
		AccessToken:        loginResp.AccessToken,
		RefreshToken:       loginResp.RefreshToken, // Also include in body for mobile apps
		TokenType:          loginResp.TokenType,
		ExpiresIn:          loginResp.ExpiresIn,
		User:               response.MapAuthUserToResponse(loginResp.User),
		MustChangePassword: loginResp.MustChangePassword,
	})
}

// RefreshToken handles POST /api/auth/refresh
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	// Try to get refresh token from cookie first, then from body
	var refreshToken string

	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		refreshToken = cookie.Value
	} else {
		var req request.RefreshTokenRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.JSONError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body")
			return
		}
		refreshToken = req.RefreshToken
	}

	if refreshToken == "" {
		response.JSONError(w, http.StatusBadRequest, "MISSING_TOKEN", "Refresh token is required")
		return
	}

	ipAddress := getClientIP(r)
	userAgent := r.UserAgent()

	loginResp, err := h.authService.RefreshToken(r.Context(), refreshToken, ipAddress, userAgent)
	if err != nil {
		logger.Log.Error("Token refresh failed: " + err.Error())

		switch {
		case errors.Is(err, auth.ErrInvalidToken), errors.Is(err, auth.ErrSessionExpired):
			response.JSONError(w, http.StatusUnauthorized, "INVALID_TOKEN", "Invalid or expired refresh token")
		case errors.Is(err, auth.ErrAccountInactive):
			response.JSONError(w, http.StatusForbidden, "ACCOUNT_INACTIVE", "Account is inactive")
		default:
			response.JSONError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "An error occurred during token refresh")
		}
		return
	}

	response.JSON(w, http.StatusOK, response.LoginResponse{
		AccessToken:        loginResp.AccessToken,
		RefreshToken:       loginResp.RefreshToken,
		TokenType:          loginResp.TokenType,
		ExpiresIn:          loginResp.ExpiresIn,
		User:               response.MapAuthUserToResponse(loginResp.User),
		MustChangePassword: loginResp.MustChangePassword,
	})
}

// Logout handles POST /api/auth/logout
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	// Get refresh token from cookie or body
	var refreshToken string

	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		refreshToken = cookie.Value
	} else {
		var req request.RefreshTokenRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			refreshToken = req.RefreshToken
		}
	}

	if refreshToken != "" {
		if err := h.authService.Logout(r.Context(), refreshToken); err != nil {
			logger.Log.Error("Logout failed: " + err.Error())
		}
	}

	// Clear refresh token cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1, // Delete cookie
	})

	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Logged out successfully",
	})
}

// Me handles GET /api/auth/me
func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	// Get user from context (set by auth middleware)
	_, ok := r.Context().Value("user").(*auth.JWTClaims)
	if !ok {
		response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	user, err := h.authService.VerifyAccessToken(r.Context(), "")
	if err != nil {
		response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"user": response.MapAuthUserToResponse(&auth.AdminUser{
			ID:       user.UserID,
			Username: user.Username,
			Role:     user.Role,
		}),
	})
}

// ChangePassword handles POST /api/auth/change-password
func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.JWTClaims)
	if !ok {
		response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	var req request.ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.JSONError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body")
		return
	}

	if req.CurrentPassword == "" || req.NewPassword == "" {
		response.JSONError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Current password and new password are required")
		return
	}

	if err := h.authService.ChangePassword(r.Context(), claims.UserID, req.CurrentPassword, req.NewPassword); err != nil {
		logger.Log.Error("Password change failed: " + err.Error())

		switch {
		case errors.Is(err, auth.ErrInvalidCredentials):
			response.JSONError(w, http.StatusUnauthorized, "INVALID_PASSWORD", "Current password is incorrect")
		default:
			response.JSONError(w, http.StatusBadRequest, "PASSWORD_ERROR", err.Error())
		}
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{
		"message": "Password changed successfully. Please login again.",
	})
}

// GetSessions handles GET /api/auth/sessions
func (h *AuthHandler) GetSessions(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.JWTClaims)
	if !ok {
		response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	sessions, err := h.authService.GetActiveSessions(r.Context(), claims.UserID)
	if err != nil {
		logger.Log.Error("Failed to get sessions: " + err.Error())
		response.JSONError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve sessions")
		return
	}

	sessionInfos := make([]*response.SessionInfo, len(sessions))
	for i, session := range sessions {
		sessionInfos[i] = response.MapSessionToResponse(session)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"sessions": sessionInfos,
	})
}

// GetLoginHistory handles GET /api/auth/login-history
func (h *AuthHandler) GetLoginHistory(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.JWTClaims)
	if !ok {
		response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
		return
	}

	history, err := h.authService.GetLoginHistory(r.Context(), claims.UserID, 50)
	if err != nil {
		logger.Log.Error("Failed to get login history: " + err.Error())
		response.JSONError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to retrieve login history")
		return
	}

	historyInfos := make([]*response.LoginHistoryInfo, len(history))
	for i, h := range history {
		historyInfos[i] = response.MapLoginHistoryToResponse(h)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"history": historyInfos,
	})
}

// Helper functions

func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header first (for proxies/load balancers)
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}

	// Check X-Real-IP header
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	ip := r.RemoteAddr
	if idx := strings.LastIndex(ip, ":"); idx != -1 {
		ip = ip[:idx]
	}
	return ip
}
