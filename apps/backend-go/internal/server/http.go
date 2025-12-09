package server

import (
	"context"
	"fmt"
	"net/http"

	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/routes"
	"monorepo/backend-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

type HTTPServer struct {
	server *http.Server
	port   string
}

func NewHTTPServer(cfg *config.Config) *HTTPServer {
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()
	routes.RegisterRoutes(router, cfg)

	return &HTTPServer{
		server: &http.Server{
			Addr:    ":" + cfg.HTTPPort,
			Handler: router,
		},
		port: cfg.HTTPPort,
	}
}

func (s *HTTPServer) Start() error {
	logger.Log.Info(fmt.Sprintf("🚀 HTTP Server listening on port %s", s.port))
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("HTTP server error: %w", err)
	}
	return nil
}

func (s *HTTPServer) Shutdown(ctx context.Context) error {
	logger.Log.Info("Shutting down HTTP server...")

	if err := s.server.Shutdown(ctx); err != nil {
		return fmt.Errorf("HTTP server shutdown error: %w", err)
	}

	logger.Log.Info("✅ HTTP server stopped")
	return nil
}
