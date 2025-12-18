package container

import (
	"fmt"

	"monorepo/backend-go/internal/application/devtoolkit/command"
	"monorepo/backend-go/internal/application/devtoolkit/query"
	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	gormdevtoolkit "monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/postgres"

	"gorm.io/gorm"
)

type Container struct {
	DB *gorm.DB

	// Repositories (Domain Ports)
	CategoryRepo repository.CategoryRepository
	ServiceRepo  repository.ServiceRepository

	// Command Handlers (Write Operations)
	CreateCategoryHandler *command.CreateCategoryHandler
	UpdateCategoryHandler *command.UpdateCategoryHandler
	DeleteCategoryHandler *command.DeleteCategoryHandler
	CreateToolkitHandler  *command.CreateToolkitHandler
	UpdateToolkitHandler  *command.UpdateToolkitHandler
	DeleteToolkitHandler  *command.DeleteToolkitHandler

	// Query Handlers (Read Operations)
	ListCategoriesHandler *query.ListCategoriesHandler
	GetCategoryHandler    *query.GetCategoryHandler
	ListServicesHandler   *query.ListServicesHandler
	ListToolkitsHandler   *query.ListToolkitsHandler
	GetToolkitHandler     *query.GetToolkitHandler
}

// New creates and initializes a new Container with all dependencies
func New(cfg *config.Config) (*Container, error) {
	// Initialize database connection
	db, err := postgres.NewConnection(cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create database connection: %w", err)
	}

	// Run migrations
	if err := gormdevtoolkit.AutoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	// Initialize repositories (Adapters implementing Domain Ports)
	categoryRepo := gormdevtoolkit.NewCategoryRepository(db)
	serviceRepo := gormdevtoolkit.NewServiceRepository(db)

	// Initialize command handlers
	createCategoryHandler := command.NewCreateCategoryHandler(categoryRepo)
	updateCategoryHandler := command.NewUpdateCategoryHandler(categoryRepo)
	deleteCategoryHandler := command.NewDeleteCategoryHandler(categoryRepo)
	createToolkitHandler := command.NewCreateToolkitHandler(categoryRepo, serviceRepo)
	updateToolkitHandler := command.NewUpdateToolkitHandler(categoryRepo, serviceRepo)
	deleteToolkitHandler := command.NewDeleteToolkitHandler(serviceRepo)

	// Initialize query handlers
	listCategoriesHandler := query.NewListCategoriesHandler(categoryRepo)
	getCategoryHandler := query.NewGetCategoryHandler(categoryRepo)
	listServicesHandler := query.NewListServicesHandler(serviceRepo)
	listToolkitsHandler := query.NewListToolkitsHandler(serviceRepo)
	getToolkitHandler := query.NewGetToolkitHandler(serviceRepo)

	return &Container{
		DB:                    db,
		CategoryRepo:          categoryRepo,
		ServiceRepo:           serviceRepo,
		CreateCategoryHandler: createCategoryHandler,
		UpdateCategoryHandler: updateCategoryHandler,
		DeleteCategoryHandler: deleteCategoryHandler,
		CreateToolkitHandler:  createToolkitHandler,
		UpdateToolkitHandler:  updateToolkitHandler,
		DeleteToolkitHandler:  deleteToolkitHandler,
		ListCategoriesHandler: listCategoriesHandler,
		GetCategoryHandler:    getCategoryHandler,
		ListServicesHandler:   listServicesHandler,
		ListToolkitsHandler:   listToolkitsHandler,
		GetToolkitHandler:     getToolkitHandler,
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
