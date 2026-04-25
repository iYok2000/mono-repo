package container

import (
	"database/sql"
	"fmt"

	bannercommand "monorepo/backend-go/internal/application/banner/command"
	bannerquery "monorepo/backend-go/internal/application/banner/query"
	homesettingscommand "monorepo/backend-go/internal/application/homesettings/command"
	homesettingsquery "monorepo/backend-go/internal/application/homesettings/query"
	productcommand "monorepo/backend-go/internal/application/product/command"
	productquery "monorepo/backend-go/internal/application/product/query"
	productvalidation "monorepo/backend-go/internal/application/product/validation"
	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/core/domain/auth"
	bannerrepository "monorepo/backend-go/internal/core/domain/banner/repository"
	homesettingsrepository "monorepo/backend-go/internal/core/domain/homesettings/repository"
	productrepository "monorepo/backend-go/internal/core/domain/product/repository"
	gormbanner "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner"
	gormhomesettings "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/homesettings"
	gormproduct "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/postgres"

	"gorm.io/gorm"
)

type Container struct {
	DB    *gorm.DB
	SqlDB *sql.DB

	// Repositories (Domain Ports)
	BannerRepo       bannerrepository.BannerRepository
	HomeSettingsRepo homesettingsrepository.HomeSettingsRepository
	CategoryRepo     productrepository.CategoryRepository
	ServiceRepo      productrepository.ServiceRepository
	AuthRepo         auth.Repository

	// Services
	AuthService *auth.Service

	// Banner Command Handlers
	CreateBannerHandler   *bannercommand.CreateBannerHandler
	UpdateBannerHandler   *bannercommand.UpdateBannerHandler
	DeleteBannerHandler   *bannercommand.DeleteBannerHandler
	ReorderBannersHandler *bannercommand.ReorderBannersHandler

	// Banner Query Handlers
	ListBannersHandler *bannerquery.ListBannersHandler
	GetBannerHandler   *bannerquery.GetBannerHandler

	// HomeSettings Handlers
	GetHomeSettingsHandler    *homesettingsquery.GetHomeSettingsHandler
	UpdateHomeSettingsHandler *homesettingscommand.UpdateHomeSettingsHandler

	// Product Command Handlers
	CreateProductHandler  *productcommand.CreateProductHandler
	UpdateProductHandler  *productcommand.UpdateProductHandler
	DeleteProductHandler  *productcommand.DeleteProductHandler
	CreateCategoryHandler *productcommand.CreateCategoryHandler
	UpdateCategoryHandler *productcommand.UpdateCategoryHandler
	DeleteCategoryHandler *productcommand.DeleteCategoryHandler

	// Product Query Handlers
	ListProductsHandler   *productquery.ListProductsHandler
	GetProductHandler     *productquery.GetProductHandler
	ListCategoriesHandler *productquery.ListCategoriesHandler
	GetCategoryHandler    *productquery.GetCategoryHandler
}

// New creates and initializes a new Container with all dependencies
func New(cfg *config.Config) (*Container, error) {
	// Initialize database connection
	db, err := postgres.NewConnection(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create database connection: %w", err)
	}

	// Get sql.DB for auth repository
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	// Run migrations
	if err := gormbanner.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run banner migrations: %w", err)
	}
	if err := gormhomesettings.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run homesettings migrations: %w", err)
	}
	if err := gormproduct.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run product migrations: %w", err)
	}

	// Initialize repositories (Adapters implementing Domain Ports)
	bannerRepo := gormbanner.NewBannerRepository(db)
	homeSettingsRepo := gormhomesettings.NewHomeSettingsRepository(db)
	categoryRepo := gormproduct.NewCategoryRepository(db)
	serviceRepo := gormproduct.NewServiceRepository(db)

	// Initialize auth repository and service
	authRepo := auth.NewPostgresRepository(sqlDB)
	authService := auth.NewService(authRepo, cfg.JWTSecret)

	// Initialize validators
	contentValidator := productvalidation.NewContentValidator()

	// Initialize banner command handlers
	createBannerHandler := bannercommand.NewCreateBannerHandler(bannerRepo)
	updateBannerHandler := bannercommand.NewUpdateBannerHandler(bannerRepo)
	deleteBannerHandler := bannercommand.NewDeleteBannerHandler(bannerRepo)
	reorderBannersHandler := bannercommand.NewReorderBannersHandler(bannerRepo)

	// Initialize banner query handlers
	listBannersHandler := bannerquery.NewListBannersHandler(bannerRepo)
	getBannerHandler := bannerquery.NewGetBannerHandler(bannerRepo)

	// Initialize home settings handlers
	getHomeSettingsHandler := homesettingsquery.NewGetHomeSettingsHandler(homeSettingsRepo)
	updateHomeSettingsHandler := homesettingscommand.NewUpdateHomeSettingsHandler(homeSettingsRepo)

	// Initialize product command handlers
	createProductHandler := productcommand.NewCreateProductHandler(categoryRepo, serviceRepo)
	updateProductHandler := productcommand.NewUpdateProductHandler(categoryRepo, serviceRepo)
	deleteProductHandler := productcommand.NewDeleteProductHandler(serviceRepo)
	createCategoryHandler := productcommand.NewCreateCategoryHandler(categoryRepo, contentValidator)
	updateCategoryHandler := productcommand.NewUpdateCategoryHandler(categoryRepo, contentValidator)
	deleteCategoryHandler := productcommand.NewDeleteCategoryHandler(categoryRepo)

	// Initialize product query handlers
	listProductsHandler := productquery.NewListProductsHandler(serviceRepo)
	getProductHandler := productquery.NewGetProductHandler(serviceRepo)
	listCategoriesHandler := productquery.NewListCategoriesHandler(categoryRepo)
	getCategoryHandler := productquery.NewGetCategoryHandler(categoryRepo)

	return &Container{
		DB:                        db,
		SqlDB:                     sqlDB,
		BannerRepo:                bannerRepo,
		HomeSettingsRepo:          homeSettingsRepo,
		CategoryRepo:              categoryRepo,
		ServiceRepo:               serviceRepo,
		AuthRepo:                  authRepo,
		AuthService:               authService,
		CreateBannerHandler:       createBannerHandler,
		UpdateBannerHandler:       updateBannerHandler,
		DeleteBannerHandler:       deleteBannerHandler,
		ReorderBannersHandler:     reorderBannersHandler,
		ListBannersHandler:        listBannersHandler,
		GetBannerHandler:          getBannerHandler,
		GetHomeSettingsHandler:    getHomeSettingsHandler,
		UpdateHomeSettingsHandler: updateHomeSettingsHandler,
		CreateProductHandler:      createProductHandler,
		UpdateProductHandler:      updateProductHandler,
		DeleteProductHandler:      deleteProductHandler,
		CreateCategoryHandler:     createCategoryHandler,
		UpdateCategoryHandler:     updateCategoryHandler,
		DeleteCategoryHandler:     deleteCategoryHandler,
		ListProductsHandler:       listProductsHandler,
		GetProductHandler:         getProductHandler,
		ListCategoriesHandler:     listCategoriesHandler,
		GetCategoryHandler:        getCategoryHandler,
	}, nil
}

// Close closes all resources held by the container
func (c *Container) Close() error {
	sqlDB, err := c.DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}

	if err := sqlDB.Close(); err != nil {
		return fmt.Errorf("failed to close database: %w", err)
	}

	return nil
}
