package devtoolkit

import (
	"context"
	"fmt"

	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/mapper"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"

	"gorm.io/gorm"
)

// serviceRepositoryImpl implements the domain ServiceRepository interface
type serviceRepositoryImpl struct {
	db *gorm.DB
}

// NewServiceRepository creates a new service repository implementation
func NewServiceRepository(db *gorm.DB) repository.ServiceRepository {
	return &serviceRepositoryImpl{db: db}
}

func (r *serviceRepositoryImpl) ListServices(ctx context.Context) ([]*entity.ServiceItem, error) {
	var models []model.DevToolkitModel

	if err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Detail").
		Order("category_id ASC, title ASC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list services: %w", err)
	}

	return mapper.ServiceItemsToDomain(models), nil
}
