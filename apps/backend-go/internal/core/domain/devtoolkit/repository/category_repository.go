package repository

import (
	"context"
	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
)

// CategoryRepository defines the contract for category data access
// This is a PORT in Hexagonal Architecture - defined in domain layer
type CategoryRepository interface {
	List(ctx context.Context) ([]*entity.Category, error)
	GetByID(ctx context.Context, id string) (*entity.Category, error)
	Create(ctx context.Context, category *entity.Category) error
	Update(ctx context.Context, category *entity.Category) error
	Delete(ctx context.Context, id string) error
}
