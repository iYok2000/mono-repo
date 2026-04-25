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

		// Product endpoints - Protected with authentication
		productHandler := handler.NewProductHandler(
			cnt.CreateProductHandler,
			cnt.UpdateProductHandler,
			cnt.DeleteProductHandler,
			cnt.ListProductsHandler,
			cnt.GetProductHandler,
		)

		products := api.Group("/products")
		{
			// Read operations with rate limiting (prevent abuse)
			products.GET("", apiRateLimiter.LimitGin(), productHandler.ListProducts)
			products.GET("/:id", apiRateLimiter.LimitGin(), productHandler.GetProduct)
			// Write operations require authentication + rate limiting
			products.POST("", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), productHandler.CreateProduct)
			products.PUT("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), productHandler.UpdateProduct)
			products.DELETE("/:id", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), productHandler.DeleteProduct)
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

		// Settings endpoints
		settingsHandler := handler.NewSettingsHandler(cnt.SqlDB)
		settings := api.Group("/settings")
		{
			settings.GET("/home-sections", settingsHandler.GetHomeSections)
			settings.PUT("/home-sections", authMiddleware.RequireAuth(), apiRateLimiter.LimitGin(), settingsHandler.UpdateHomeSections)
		}
	}
}
