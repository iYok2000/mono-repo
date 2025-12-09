package routes

import (
	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/handler/rest"
	"monorepo/backend-go/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, cfg *config.Config) {
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg))

	router.GET("/", rest.Root(cfg))
	router.GET("/health", rest.HealthCheck(cfg))
	router.GET("/ping", rest.Ping())

	api := router.Group("/api")
	{
		grpc := api.Group("/grpc")
		{
			grpc.POST("/say-hello", rest.SayHelloREST(cfg))
			grpc.POST("/say-hello-stream", rest.SayHelloStreamREST(cfg))
		}
	}
}
