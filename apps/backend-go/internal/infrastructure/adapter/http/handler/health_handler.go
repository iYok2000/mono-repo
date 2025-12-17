package handler

import (
	"monorepo/backend-go/internal/config"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type PingResponse struct {
	Message string `json:"message"`
}

// Ping handles GET /ping
func Ping() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, PingResponse{
			Message: "pong",
		})
	}
}

type RootResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Service string      `json:"service"`
	Data    interface{} `json:"data,omitempty"`
}

type EndpointsInfo struct {
	Health string `json:"health"`
	Ping   string `json:"ping"`
}

// Root handles GET /
func Root(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		response := RootResponse{
			Success: true,
			Message: "Welcome to " + cfg.ServiceName + " service!",
			Service: cfg.ServiceName,
			Data: EndpointsInfo{
				Health: "/health",
				Ping:   "/ping",
			},
		}
		c.JSON(http.StatusOK, response)
	}
}

type HealthResponse struct {
	Status      string       `json:"status"`
	Service     string       `json:"service"`
	Timestamp   string       `json:"timestamp"`
	Environment string       `json:"environment"`
	Servers     ServerStatus `json:"servers"`
}

type ServerStatus struct {
	HTTP HTTPStatus `json:"http"`
	GRPC GRPCStatus `json:"grpc"`
}

type HTTPStatus struct {
	Enabled bool   `json:"enabled"`
	Port    string `json:"port,omitempty"`
	Status  string `json:"status,omitempty"`
}

type GRPCStatus struct {
	Enabled bool   `json:"enabled"`
	Port    string `json:"port,omitempty"`
	Status  string `json:"status,omitempty"`
}

// HealthCheck handles GET /health
func HealthCheck(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		data := HealthResponse{
			Status:      "healthy",
			Service:     cfg.ServiceName,
			Timestamp:   time.Now().Format(time.RFC3339),
			Environment: cfg.Environment,
			Servers: ServerStatus{
				HTTP: HTTPStatus{
					Enabled: cfg.EnableHTTP,
					Port:    cfg.HTTPPort,
					Status:  "running",
				},
				GRPC: GRPCStatus{
					Enabled: cfg.EnableGRPC,
					Port:    cfg.GRPCPort,
					Status: func() string {
						if cfg.EnableGRPC {
							return "running"
						}
						return "disabled"
					}(),
				},
			},
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Service is healthy",
			"data":    data,
		})
	}
}
