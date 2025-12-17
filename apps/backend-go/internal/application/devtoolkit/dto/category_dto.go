package dto

import "monorepo/backend-go/internal/core/domain/devtoolkit/entity"

// CategoryDTO is a data transfer object for Category
// DTOs are anemic - no behavior, only data transfer
// Pure data structure without framework-specific tags
type CategoryDTO struct {
	ID     string
	NameEn string
	NameTh string
}

// CategoryToDTO converts domain entity to DTO
func CategoryToDTO(c *entity.Category) CategoryDTO {
	return CategoryDTO{
		ID:     c.ID(),
		NameEn: c.NameEn(),
		NameTh: c.NameTh(),
	}
}

// CategoriesToDTO converts slice of domain entities to DTOs
func CategoriesToDTO(categories []*entity.Category) []CategoryDTO {
	dtos := make([]CategoryDTO, 0, len(categories))
	for _, c := range categories {
		dtos = append(dtos, CategoryToDTO(c))
	}
	return dtos
}
