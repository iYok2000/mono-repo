package repository

import (
	"context"

	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
)

// ServiceRepository defines the contract for service item data access
// This is a PORT in Hexagonal Architecture - defined in domain layer
type ServiceRepository interface {
	ListServices(ctx context.Context) ([]*entity.ServiceItem, error)
	GetByID(ctx context.Context, id string) (*model.DevToolkitModel, error)
	CreateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
	UpdateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error
	Delete(ctx context.Context, id string) error
}
