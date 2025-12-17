package repository

import (
	"context"
	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
)

// ServiceRepository defines the contract for service item data access
// This is a PORT in Hexagonal Architecture - defined in domain layer
type ServiceRepository interface {
	ListServices(ctx context.Context) ([]*entity.ServiceItem, error)
}
