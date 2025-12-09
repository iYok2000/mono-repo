package rest

import (
	"monorepo/backend-go/internal/config"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

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
