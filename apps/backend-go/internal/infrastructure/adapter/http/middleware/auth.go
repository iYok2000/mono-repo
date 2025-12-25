package middleware

import (
	"context"
	"net/http"
	"strings"

	"monorepo/backend-go/internal/core/domain/auth"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"
	"monorepo/backend-go/pkg/logger"
)

// AuthMiddleware verifies JWT tokens
type AuthMiddleware struct {
	authService *auth.Service
}

// NewAuthMiddleware creates a new auth middleware
func NewAuthMiddleware(authService *auth.Service) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
	}
}

// RequireAuth middleware requires valid JWT token
func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			response.JSONError(w, http.StatusUnauthorized, "MISSING_TOKEN", "Authorization header is required")
			return
		}

		// Check Bearer scheme
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.JSONError(w, http.StatusUnauthorized, "INVALID_TOKEN", "Invalid authorization header format")
			return
		}

		token := parts[1]

		// Verify token
		claims, err := m.authService.VerifyAccessToken(r.Context(), token)
		if err != nil {
			logger.Log.Error("Token verification failed: " + err.Error())
			response.JSONError(w, http.StatusUnauthorized, "INVALID_TOKEN", "Invalid or expired token")
			return
		}

		// Add claims to context
		ctx := context.WithValue(r.Context(), "user", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireRole middleware requires specific role
func (m *AuthMiddleware) RequireRole(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := r.Context().Value("user").(*auth.JWTClaims)
			if !ok {
				response.JSONError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
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
				response.JSONError(w, http.StatusForbidden, "FORBIDDEN", "Insufficient permissions")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// GetUserFromContext retrieves user claims from context
func GetUserFromContext(ctx context.Context) (*auth.JWTClaims, bool) {
	claims, ok := ctx.Value("user").(*auth.JWTClaims)
	return claims, ok
}
