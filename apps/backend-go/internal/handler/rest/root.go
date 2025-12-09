package rest

import (
	"monorepo/backend-go/internal/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
