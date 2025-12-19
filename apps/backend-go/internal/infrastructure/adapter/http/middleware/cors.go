package middleware

import (
	"time"

	"monorepo/backend-go/internal/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORS is a middleware that configures Cross-Origin Resource Sharing
func CORS(cfg *config.Config) gin.HandlerFunc {
	// Use allowed origins from config (configurable via CORS_ALLOWED_ORIGINS env)
	allowOrigins := cfg.CorsAllowedOrigins

	// Fallback to FrontendURL if no CORS origins configured
	if len(allowOrigins) == 0 {
		allowOrigins = []string{cfg.FrontendURL}
	}

	return cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
