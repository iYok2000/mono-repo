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
	router.Use(middleware.SecurityHeadersGin()) // Security headers
	router.Use(middleware.CORS(cfg))

	// Rate limiters
	loginRateLimiter := middleware.NewLoginRateLimiter()
	apiRateLimiter := middleware.NewAPIRateLimiter()

	// Health check endpoints
	router.GET("/", handler.Root(cfg))
	router.GET("/health", handler.HealthCheck(cfg))
	router.GET("/ping", handler.Ping())

	// API routes
	api := router.Group("/api")
	{
		// Authentication endpoints
		authHandler := handler.NewAuthGinHandler(cnt.AuthService)
		authMiddleware := middleware.NewAuthGinMiddleware(cnt.AuthService)

		auth := api.Group("/auth")
		{
			auth.POST("/login", loginRateLimiter.LimitGin(), authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
			auth.POST("/logout", authHandler.Logout)
			auth.GET("/me", authMiddleware.RequireAuth(), authHandler.Me)
			auth.POST("/change-password", authMiddleware.RequireAuth(), authHandler.ChangePassword)
		}

		// Category endpoints - Protected with authentication
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
			// Write operations require authentication
			categories.POST("", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), categoryHandler.CreateCategory)
			categories.PUT("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), categoryHandler.UpdateCategory)
			categories.DELETE("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), categoryHandler.DeleteCategory)
		}

		// Toolkit endpoints - Protected with authentication
		toolkitHandler := handler.NewToolkitHandler(
			cnt.CreateToolkitHandler,
			cnt.UpdateToolkitHandler,
			cnt.DeleteToolkitHandler,
			cnt.ListToolkitsHandler,
			cnt.GetToolkitHandler,
		)

		toolkits := api.Group("/toolkits")
		{
			toolkits.GET("", toolkitHandler.ListToolkits)
			toolkits.GET("/:id", toolkitHandler.GetToolkit)
			// Write operations require authentication
			toolkits.POST("", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), toolkitHandler.CreateToolkit)
			toolkits.PUT("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), toolkitHandler.UpdateToolkit)
			toolkits.DELETE("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), toolkitHandler.DeleteToolkit)
		}

		// Banner endpoints - Protected with authentication
		bannerHandler := handler.NewBannerHandler(
			cnt.CreateBannerHandler,
			cnt.UpdateBannerHandler,
			cnt.DeleteBannerHandler,
			cnt.ReorderBannersHandler,
			cnt.ListBannersHandler,
			cnt.GetBannerHandler,
		)

		banners := api.Group("/banners")
		{
			banners.GET("", bannerHandler.ListBanners)
			banners.GET("/:id", bannerHandler.GetBanner)
			// Write operations require authentication
			banners.POST("", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), bannerHandler.CreateBanner)
			banners.PUT("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), bannerHandler.UpdateBanner)
			banners.DELETE("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), bannerHandler.DeleteBanner)
			banners.POST("/reorder", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), bannerHandler.ReorderBanners)
		}
	}
}
