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

func (r *serviceRepositoryImpl) GetByID(ctx context.Context, id string) (*model.DevToolkitModel, error) {
	var toolkit model.DevToolkitModel
	if err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Detail").
		Where("id = ?", id).
		First(&toolkit).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("get toolkit by id: %w", err)
	}
	return &toolkit, nil
}

func (r *serviceRepositoryImpl) CreateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(toolkit).Error; err != nil {
			return fmt.Errorf("create toolkit: %w", err)
		}
		if err := tx.Create(detail).Error; err != nil {
			return fmt.Errorf("create toolkit detail: %w", err)
		}
		return nil
	})
}

func (r *serviceRepositoryImpl) UpdateWithDetail(ctx context.Context, toolkit *model.DevToolkitModel, detail *model.DevToolkitDetailModel) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&model.DevToolkitModel{}).
			Where("id = ?", toolkit.ID).
			Updates(toolkit).Error; err != nil {
			return fmt.Errorf("update toolkit: %w", err)
		}
		if err := tx.Model(&model.DevToolkitDetailModel{}).
			Where("toolkit_id = ?", toolkit.ID).
			Updates(detail).Error; err != nil {
			return fmt.Errorf("update toolkit detail: %w", err)
		}
		return nil
	})
}

func (r *serviceRepositoryImpl) Delete(ctx context.Context, id string) error {
	// Detail will be cascade deleted automatically due to OnDelete:CASCADE constraint
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", id).Delete(&model.DevToolkitModel{}).Error; err != nil {
			return fmt.Errorf("delete toolkit: %w", err)
		}
		return nil
	})
}
