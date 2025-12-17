package routes

import (
	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/container"
	"monorepo/backend-go/internal/infrastructure/adapter/http/handler"
	"monorepo/backend-go/internal/infrastructure/adapter/http/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes registers all HTTP routes with the Gin engine
// Uses dependency injection via container
func RegisterRoutes(router *gin.Engine, cfg *config.Config, cnt *container.Container) {
	// Global middleware
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg))

	// Health check endpoints
	router.GET("/", handler.Root(cfg))
	router.GET("/health", handler.HealthCheck(cfg))
	router.GET("/ping", handler.Ping())

	// API routes
	api := router.Group("/api")
	{
		// Category endpoints
		categoryHandler := handler.NewCategoryHandler(
			cnt.CreateCategoryHandler,
			cnt.UpdateCategoryHandler,
			cnt.DeleteCategoryHandler,
			cnt.ListCategoriesHandler,
			cnt.GetCategoryHandler,
		)

		categories := api.Group("/categories")
		{
			categories.GET("", categoryHandler.ListCategories)
			categories.GET("/:id", categoryHandler.GetCategory)
			categories.POST("", categoryHandler.CreateCategory)
			categories.PUT("/:id", categoryHandler.UpdateCategory)
			categories.DELETE("/:id", categoryHandler.DeleteCategory)
		}

		// TODO: Add service endpoints when needed
		// services := api.Group("/services")
		// {
		// 	services.GET("", serviceHandler.ListServices)
		// }
	}
}
