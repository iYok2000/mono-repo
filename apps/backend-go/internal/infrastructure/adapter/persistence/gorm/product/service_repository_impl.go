package product

import (
	"context"
	"fmt"

	"monorepo/backend-go/internal/core/domain/product/entity"
	"monorepo/backend-go/internal/core/domain/product/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/mapper"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/model"

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
	var models []model.ProductModel

	if err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Detail").
		Order("category_id ASC, title ASC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list services: %w", err)
	}

	return mapper.ServiceItemsToDomain(models), nil
}

func (r *serviceRepositoryImpl) GetByID(ctx context.Context, id string) (*model.ProductModel, error) {
	var product model.ProductModel
	if err := r.db.WithContext(ctx).
		Preload("Category").
		Preload("Detail").
		Where("id = ?", id).
		First(&product).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("get product by id: %w", err)
	}
	return &product, nil
}

func (r *serviceRepositoryImpl) CreateWithDetail(ctx context.Context, product *model.ProductModel, detail *model.ProductDetailModel) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(product).Error; err != nil {
			return fmt.Errorf("create product: %w", err)
		}
		if err := tx.Create(detail).Error; err != nil {
			return fmt.Errorf("create product detail: %w", err)
		}
		return nil
	})
}

func (r *serviceRepositoryImpl) UpdateWithDetail(ctx context.Context, product *model.ProductModel, detail *model.ProductDetailModel) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&model.ProductModel{}).
			Where("id = ?", product.ID).
			Updates(product).Error; err != nil {
			return fmt.Errorf("update product: %w", err)
		}
		if err := tx.Model(&model.ProductDetailModel{}).
			Where("product_id = ?", product.ID).
			Updates(detail).Error; err != nil {
			return fmt.Errorf("update product detail: %w", err)
		}
		return nil
	})
}

func (r *serviceRepositoryImpl) Delete(ctx context.Context, id string) error {
	// Detail will be cascade deleted automatically due to OnDelete:CASCADE constraint
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", id).Delete(&model.ProductModel{}).Error; err != nil {
			return fmt.Errorf("delete product: %w", err)
		}
		return nil
	})
}
