package mapper

import (
	"encoding/json"

	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
	"monorepo/backend-go/internal/core/domain/devtoolkit/valueobject"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
)

// ServiceItemToDomain converts GORM model to domain entity
func ServiceItemToDomain(m *model.DevToolkitModel) *entity.ServiceItem {
	// Parse tags from JSONB
	var tags []string
	if len(m.Tags) > 0 {
		_ = json.Unmarshal(m.Tags, &tags)
	}
	if tags == nil {
		tags = []string{}
	}

	// Get description from detail
	description := ""
	if m.Detail != nil {
		description = m.Detail.Description
	}

	// Get category name
	categoryName := m.CategoryID
	if m.Category != nil {
		categoryName = m.Category.NameEn
	}

	// Use ReconstructServiceItem to skip validation
	return entity.ReconstructServiceItem(
		m.ID,
		m.ID, // itemID is same as ID
		m.Title,
		categoryName,
		description,
		valueobject.ServiceStatus(m.Status),
		tags,
		m.Image,
	)
}

// ServiceItemsToModel converts domain entity to GORM model
func ServiceItemToModel(s *entity.ServiceItem) *model.DevToolkitModel {
	// Convert tags to JSONB
	tags, _ := json.Marshal(s.Tags())

	return &model.DevToolkitModel{
		ID:         s.ID(),
		CategoryID: s.Category(),
		Title:      s.Title(),
		Status:     s.Status().String(),
		Tags:       tags,
		Image:      s.Image(),
	}
}

// ServiceItemsToDomain converts slice of models to domain entities
func ServiceItemsToDomain(models []model.DevToolkitModel) []*entity.ServiceItem {
	entities := make([]*entity.ServiceItem, 0, len(models))
	for i := range models {
		entities = append(entities, ServiceItemToDomain(&models[i]))
	}
	return entities
}
