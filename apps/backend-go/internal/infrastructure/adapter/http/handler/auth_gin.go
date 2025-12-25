package handler

import (
	"net/http"

	"monorepo/backend-go/internal/core/domain/auth"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"
	"monorepo/backend-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

// AuthGinHandler handles authentication endpoints for Gin framework
type AuthGinHandler struct {
	authService *auth.Service
}

// NewAuthGinHandler creates a new Gin auth handler
func NewAuthGinHandler(authService *auth.Service) *AuthGinHandler {
	return &AuthGinHandler{
		authService: authService,
	}
}

// Login handles POST /api/auth/login
func (h *AuthGinHandler) Login(c *gin.Context) {
	var req request.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INVALID_REQUEST",
				"message": "Invalid request body",
			},
		})
		return
	}

	if err := req.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	// Get client IP and User-Agent
	ipAddress := c.ClientIP()
	userAgent := c.Request.UserAgent()

	loginReq := &auth.LoginRequest{
		Username:  req.Username,
		Password:  req.Password,
		IPAddress: ipAddress,
		UserAgent: userAgent,
	}

	loginResp, err := h.authService.Login(c.Request.Context(), loginReq)
	if err != nil {
		logger.Log.Error("Login failed: " + err.Error())

		var statusCode int
		var code, message string

		switch err {
		case auth.ErrInvalidCredentials:
			statusCode = http.StatusUnauthorized
			code = "INVALID_CREDENTIALS"
			message = "Invalid username or password"
		case auth.ErrAccountLocked:
			statusCode = http.StatusForbidden
			code = "ACCOUNT_LOCKED"
			message = "Account is temporarily locked due to too many failed login attempts"
		case auth.ErrAccountInactive:
			statusCode = http.StatusForbidden
			code = "ACCOUNT_INACTIVE"
			message = "Account is inactive"
		default:
			statusCode = http.StatusInternalServerError
			code = "INTERNAL_ERROR"
			message = "An error occurred during login"
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"error": gin.H{
				"code":    code,
				"message": message,
			},
		})
		return
	}

	// Set refresh token in HTTP-only cookie
	c.SetCookie(
		"refresh_token",
		loginResp.RefreshToken,
		int(auth.RefreshTokenDuration.Seconds()),
		"/",
		"",
		false, // Set to true in production (HTTPS)
		true,  // HTTP-only
	)

	// Return access token and user info
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token":         loginResp.AccessToken,
			"refresh_token":        loginResp.RefreshToken,
			"token_type":           loginResp.TokenType,
			"expires_in":           loginResp.ExpiresIn,
			"user":                 response.MapAuthUserToResponse(loginResp.User),
			"must_change_password": loginResp.MustChangePassword,
		},
	})
}

// RefreshToken handles POST /api/auth/refresh
func (h *AuthGinHandler) RefreshToken(c *gin.Context) {
	var refreshToken string

	// Try to get from cookie first
	cookie, err := c.Cookie("refresh_token")
	if err == nil {
		refreshToken = cookie
	} else {
		// Try to get from body
		var req request.RefreshTokenRequest
		if err := c.ShouldBindJSON(&req); err == nil {
			refreshToken = req.RefreshToken
		}
	}

	if refreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "MISSING_TOKEN",
				"message": "Refresh token is required",
			},
		})
		return
	}

	ipAddress := c.ClientIP()
	userAgent := c.Request.UserAgent()

	loginResp, err := h.authService.RefreshToken(c.Request.Context(), refreshToken, ipAddress, userAgent)
	if err != nil {
		logger.Log.Error("Token refresh failed: " + err.Error())

		var statusCode int
		var code, message string

		switch err {
		case auth.ErrInvalidToken, auth.ErrSessionExpired:
			statusCode = http.StatusUnauthorized
			code = "INVALID_TOKEN"
			message = "Invalid or expired refresh token"
		case auth.ErrAccountInactive:
			statusCode = http.StatusForbidden
			code = "ACCOUNT_INACTIVE"
			message = "Account is inactive"
		default:
			statusCode = http.StatusInternalServerError
			code = "INTERNAL_ERROR"
			message = "An error occurred during token refresh"
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"error": gin.H{
				"code":    code,
				"message": message,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token":         loginResp.AccessToken,
			"refresh_token":        loginResp.RefreshToken,
			"token_type":           loginResp.TokenType,
			"expires_in":           loginResp.ExpiresIn,
			"user":                 response.MapAuthUserToResponse(loginResp.User),
			"must_change_password": loginResp.MustChangePassword,
		},
	})
}

// Logout handles POST /api/auth/logout
func (h *AuthGinHandler) Logout(c *gin.Context) {
	var refreshToken string

	// Try to get from cookie
	cookie, err := c.Cookie("refresh_token")
	if err == nil {
		refreshToken = cookie
	} else {
		var req request.RefreshTokenRequest
		if err := c.ShouldBindJSON(&req); err == nil {
			refreshToken = req.RefreshToken
		}
	}

	if refreshToken != "" {
		if err := h.authService.Logout(c.Request.Context(), refreshToken); err != nil {
			logger.Log.Error("Logout failed: " + err.Error())
		}
	}

	// Clear refresh token cookie
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Logged out successfully",
		},
	})
}

// Me handles GET /api/auth/me
func (h *AuthGinHandler) Me(c *gin.Context) {
	// Get user from context (set by auth middleware)
	userClaims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Unauthorized",
			},
		})
		return
	}

	claims, ok := userClaims.(*auth.JWTClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Unauthorized",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user": gin.H{
				"id":       claims.UserID,
				"username": claims.Username,
				"role":     claims.Role,
			},
		},
	})
}

// ChangePassword handles POST /api/auth/change-password
func (h *AuthGinHandler) ChangePassword(c *gin.Context) {
	userClaims, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Unauthorized",
			},
		})
		return
	}

	claims, ok := userClaims.(*auth.JWTClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Unauthorized",
			},
		})
		return
	}

	var req request.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INVALID_REQUEST",
				"message": "Invalid request body",
			},
		})
		return
	}

	if req.CurrentPassword == "" || req.NewPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "Current password and new password are required",
			},
		})
		return
	}

	if err := h.authService.ChangePassword(c.Request.Context(), claims.UserID, req.CurrentPassword, req.NewPassword); err != nil {
		logger.Log.Error("Password change failed: " + err.Error())

		var statusCode int
		var code, message string

		if err == auth.ErrInvalidCredentials {
			statusCode = http.StatusUnauthorized
			code = "INVALID_PASSWORD"
			message = "Current password is incorrect"
		} else {
			statusCode = http.StatusBadRequest
			code = "PASSWORD_ERROR"
			message = err.Error()
		}

		c.JSON(statusCode, gin.H{
			"success": false,
			"error": gin.H{
				"code":    code,
				"message": message,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Password changed successfully. Please login again.",
		},
	})
}
