package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/container"
	"monorepo/backend-go/internal/infrastructure/adapter/http/routes"
	"monorepo/backend-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

// HTTPServer represents an HTTP server
type HTTPServer struct {
	server *http.Server
	port   string
}

// NewHTTPServer creates a new HTTP server with dependency injection
func NewHTTPServer(cfg *config.Config, cnt *container.Container) (*HTTPServer, error) {
	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Create Gin engine
	router := gin.New()

	// Register routes with dependency injection
	routes.RegisterRoutes(router, cfg, cnt)

	return &HTTPServer{
		server: &http.Server{
			Addr:           ":" + cfg.HTTPPort,
			Handler:        router,
			ReadTimeout:    10 * time.Second,
			WriteTimeout:   10 * time.Second,
			MaxHeaderBytes: 1 << 20,
		},
		port: cfg.HTTPPort,
	}, nil
}

// Start starts the HTTP server
func (s *HTTPServer) Start() error {
	logger.Log.Info(fmt.Sprintf("🚀 HTTP Server listening on port %s", s.server.Addr))
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("HTTP server error: %w", err)
	}
	return nil
}

// Shutdown gracefully shuts down the HTTP server
func (s *HTTPServer) Shutdown(ctx context.Context) error {
	logger.Log.Info("Shutting down HTTP server...")

	if err := s.server.Shutdown(ctx); err != nil {
		return fmt.Errorf("HTTP server shutdown error: %w", err)
	}

	logger.Log.Info("✅ HTTP server stopped")
	return nil
}
