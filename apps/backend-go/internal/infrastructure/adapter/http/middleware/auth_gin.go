package middleware

import (
	"net/http"
	"strings"

	"monorepo/backend-go/internal/core/domain/auth"
	"monorepo/backend-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

// AuthGinMiddleware is Gin middleware for JWT authentication
type AuthGinMiddleware struct {
	authService *auth.Service
}

// NewAuthGinMiddleware creates a new Gin auth middleware
func NewAuthGinMiddleware(authService *auth.Service) *AuthGinMiddleware {
	return &AuthGinMiddleware{
		authService: authService,
	}
}

// RequireAuth is a Gin middleware that requires valid JWT token
func (m *AuthGinMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "MISSING_TOKEN",
					"message": "Authorization header is required",
				},
			})
			c.Abort()
			return
		}

		// Check Bearer scheme
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INVALID_TOKEN",
					"message": "Invalid authorization header format",
				},
			})
			c.Abort()
			return
		}

		token := parts[1]

		// Verify token
		claims, err := m.authService.VerifyAccessToken(c.Request.Context(), token)
		if err != nil {
			logger.Log.Error("Token verification failed: " + err.Error())
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INVALID_TOKEN",
					"message": "Invalid or expired token",
				},
			})
			c.Abort()
			return
		}

		// Add claims to context
		c.Set("user", claims)
		c.Next()
	}
}

// RequireRole is a Gin middleware that requires specific role
func (m *AuthGinMiddleware) RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userClaims, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Unauthorized",
				},
			})
			c.Abort()
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
			c.Abort()
			return
		}

		// Check if user has required role
		hasRole := false
		for _, role := range roles {
			if claims.Role == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "FORBIDDEN",
					"message": "Insufficient permissions",
				},
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
