package container

import (
	"database/sql"
	"fmt"

	bannercommand "monorepo/backend-go/internal/application/banner/command"
	bannerquery "monorepo/backend-go/internal/application/banner/query"
	"monorepo/backend-go/internal/application/devtoolkit/command"
	"monorepo/backend-go/internal/application/devtoolkit/query"
	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/core/domain/auth"
	bannerrepository "monorepo/backend-go/internal/core/domain/banner/repository"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	gormbanner "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner"
	gormdevtoolkit "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/postgres"

	"gorm.io/gorm"
)

type Container struct {
	DB    *gorm.DB
	SqlDB *sql.DB

	// Repositories (Domain Ports)
	CategoryRepo repository.CategoryRepository
	ServiceRepo  repository.ServiceRepository
	BannerRepo   bannerrepository.BannerRepository
	AuthRepo     auth.Repository

	// Services
	AuthService *auth.Service

	// Command Handlers (Write Operations)
	CreateCategoryHandler  *command.CreateCategoryHandler
	UpdateCategoryHandler  *command.UpdateCategoryHandler
	DeleteCategoryHandler  *command.DeleteCategoryHandler
	CreateToolkitHandler   *command.CreateToolkitHandler
	UpdateToolkitHandler   *command.UpdateToolkitHandler
	DeleteToolkitHandler   *command.DeleteToolkitHandler
	CreateBannerHandler    *bannercommand.CreateBannerHandler
	UpdateBannerHandler    *bannercommand.UpdateBannerHandler
	DeleteBannerHandler    *bannercommand.DeleteBannerHandler
	ReorderBannersHandler  *bannercommand.ReorderBannersHandler

	// Query Handlers (Read Operations)
	ListCategoriesHandler *query.ListCategoriesHandler
	GetCategoryHandler    *query.GetCategoryHandler
	ListServicesHandler   *query.ListServicesHandler
	ListToolkitsHandler   *query.ListToolkitsHandler
	GetToolkitHandler     *query.GetToolkitHandler
	ListBannersHandler    *bannerquery.ListBannersHandler
	GetBannerHandler      *bannerquery.GetBannerHandler
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
	if err := gormdevtoolkit.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run devtoolkit migrations: %w", err)
	}
	if err := gormbanner.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run banner migrations: %w", err)
	}

	// Initialize repositories (Adapters implementing Domain Ports)
	categoryRepo := gormdevtoolkit.NewCategoryRepository(db)
	serviceRepo := gormdevtoolkit.NewServiceRepository(db)
	bannerRepo := gormbanner.NewBannerRepository(db)

	// Initialize auth repository and service
	authRepo := auth.NewPostgresRepository(sqlDB)
	authService := auth.NewService(authRepo, cfg.JWTSecret)

	// Initialize command handlers
	createCategoryHandler := command.NewCreateCategoryHandler(categoryRepo)
	updateCategoryHandler := command.NewUpdateCategoryHandler(categoryRepo)
	deleteCategoryHandler := command.NewDeleteCategoryHandler(categoryRepo)
	createToolkitHandler := command.NewCreateToolkitHandler(categoryRepo, serviceRepo)
	updateToolkitHandler := command.NewUpdateToolkitHandler(categoryRepo, serviceRepo)
	deleteToolkitHandler := command.NewDeleteToolkitHandler(serviceRepo)

	// Initialize banner command handlers
	createBannerHandler := bannercommand.NewCreateBannerHandler(bannerRepo)
	updateBannerHandler := bannercommand.NewUpdateBannerHandler(bannerRepo)
	deleteBannerHandler := bannercommand.NewDeleteBannerHandler(bannerRepo)
	reorderBannersHandler := bannercommand.NewReorderBannersHandler(bannerRepo)

	// Initialize query handlers
	listCategoriesHandler := query.NewListCategoriesHandler(categoryRepo)
	getCategoryHandler := query.NewGetCategoryHandler(categoryRepo)
	listServicesHandler := query.NewListServicesHandler(serviceRepo)
	listToolkitsHandler := query.NewListToolkitsHandler(serviceRepo)
	getToolkitHandler := query.NewGetToolkitHandler(serviceRepo)
	listBannersHandler := bannerquery.NewListBannersHandler(bannerRepo)
	getBannerHandler := bannerquery.NewGetBannerHandler(bannerRepo)

	return &Container{
		DB:                    db,
		SqlDB:                 sqlDB,
		CategoryRepo:          categoryRepo,
		ServiceRepo:           serviceRepo,
		BannerRepo:            bannerRepo,
		AuthRepo:              authRepo,
		AuthService:           authService,
		CreateCategoryHandler: createCategoryHandler,
		UpdateCategoryHandler: updateCategoryHandler,
		DeleteCategoryHandler: deleteCategoryHandler,
		CreateToolkitHandler:  createToolkitHandler,
		UpdateToolkitHandler:  updateToolkitHandler,
		DeleteToolkitHandler:  deleteToolkitHandler,
		CreateBannerHandler:   createBannerHandler,
		UpdateBannerHandler:   updateBannerHandler,
		DeleteBannerHandler:   deleteBannerHandler,
		ReorderBannersHandler: reorderBannersHandler,
		ListCategoriesHandler: listCategoriesHandler,
		GetCategoryHandler:    getCategoryHandler,
		ListServicesHandler:   listServicesHandler,
		ListToolkitsHandler:   listToolkitsHandler,
		GetToolkitHandler:     getToolkitHandler,
		ListBannersHandler:    listBannersHandler,
		GetBannerHandler:      getBannerHandler,
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
