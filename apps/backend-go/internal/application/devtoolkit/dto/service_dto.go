package dto

import "monorepo/backend-go/internal/core/domain/devtoolkit/entity"

// ServiceItemDTO is a data transfer object for ServiceItem
// Pure data structure without framework-specific tags
type ServiceItemDTO struct {
	ID          string
	ItemID      string
	Title       string
	Category    string
	Description string
	Status      string
	Tags        []string
	Image       string
}

// ServiceItemToDTO converts domain entity to DTO
func ServiceItemToDTO(s *entity.ServiceItem) ServiceItemDTO {
	return ServiceItemDTO{
		ID:          s.ID(),
		ItemID:      s.ItemID(),
		Title:       s.Title(),
		Category:    s.Category(),
		Description: s.Description(),
		Status:      s.Status().String(),
		Tags:        s.Tags(),
		Image:       s.Image(),
	}
}

// ServiceItemsToDTO converts slice of domain entities to DTOs
func ServiceItemsToDTO(services []*entity.ServiceItem) []ServiceItemDTO {
	dtos := make([]ServiceItemDTO, 0, len(services))
	for _, s := range services {
		dtos = append(dtos, ServiceItemToDTO(s))
	}
	return dtos
}
