package repository

import (
	"context"

	"monorepo/backend-go/internal/core/domain/product/entity"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/model"
)

// ServiceRepository defines the contract for service item data access
// This is a PORT in Hexagonal Architecture - defined in domain layer
type ServiceRepository interface {
	ListServices(ctx context.Context) ([]*entity.ServiceItem, error)
	GetByID(ctx context.Context, id string) (*model.ProductModel, error)
	CreateWithDetail(ctx context.Context, product *model.ProductModel, detail *model.ProductDetailModel) error
	UpdateWithDetail(ctx context.Context, product *model.ProductModel, detail *model.ProductDetailModel) error
	Delete(ctx context.Context, id string) error
}
