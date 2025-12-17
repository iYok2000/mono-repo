package mapper

import (
	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
)

// CategoryToDomain converts GORM model to domain entity
func CategoryToDomain(m *model.CategoryModel) *entity.Category {
	return entity.ReconstructCategory(m.ID, m.NameEn, m.NameTh)
}

// CategoryToModel converts domain entity to GORM model
func CategoryToModel(c *entity.Category) *model.CategoryModel {
	return &model.CategoryModel{
		ID:     c.ID(),
		NameEn: c.NameEn(),
		NameTh: c.NameTh(),
	}
}

// CategoriesToDomain converts slice of models to domain entities
func CategoriesToDomain(models []model.CategoryModel) []*entity.Category {
	entities := make([]*entity.Category, 0, len(models))
	for i := range models {
		entities = append(entities, CategoryToDomain(&models[i]))
	}
	return entities
}
