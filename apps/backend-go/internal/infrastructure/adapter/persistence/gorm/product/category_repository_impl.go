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

// categoryRepositoryImpl implements the domain CategoryRepository interface
// This is the ADAPTER in Hexagonal Architecture
type categoryRepositoryImpl struct {
	db *gorm.DB
}

// NewCategoryRepository creates a new category repository implementation
func NewCategoryRepository(db *gorm.DB) repository.CategoryRepository {
	return &categoryRepositoryImpl{db: db}
}

func (r *categoryRepositoryImpl) List(ctx context.Context) ([]*entity.Category, error) {
	var models []model.CategoryModel

	if err := r.db.WithContext(ctx).
		Order("id ASC").
		Find(&models).Error; err != nil {
		return nil, fmt.Errorf("list categories: %w", err)
	}

	return mapper.CategoriesToDomain(models), nil
}

func (r *categoryRepositoryImpl) GetByID(ctx context.Context, id string) (*entity.Category, error) {
	var m model.CategoryModel

	if err := r.db.WithContext(ctx).
		First(&m, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Not found is not an error in domain logic
		}
		return nil, fmt.Errorf("get category by id: %w", err)
	}

	return mapper.CategoryToDomain(&m), nil
}

func (r *categoryRepositoryImpl) Create(ctx context.Context, category *entity.Category) error {
	m := mapper.CategoryToModel(category)

	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return fmt.Errorf("create category: %w", err)
	}

	return nil
}

func (r *categoryRepositoryImpl) Update(ctx context.Context, category *entity.Category) error {
	m := mapper.CategoryToModel(category)

	if err := r.db.WithContext(ctx).
		Model(&model.CategoryModel{}).
		Where("id = ?", category.ID()).
		Updates(map[string]interface{}{
			"name_en": m.NameEn,
			"name_th": m.NameTh,
		}).Error; err != nil {
		return fmt.Errorf("update category: %w", err)
	}

	return nil
}

func (r *categoryRepositoryImpl) Delete(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).
		Delete(&model.CategoryModel{}, "id = ?", id).Error; err != nil {
		return fmt.Errorf("delete category: %w", err)
	}

	return nil
}
