package response

import "monorepo/backend-go/internal/application/devtoolkit/dto"

// CategoryResponse represents the HTTP response for a category
// This is HTTP-specific and can have framework tags
type CategoryResponse struct {
	ID     string `json:"id"`
	NameEn string `json:"name_en"`
	NameTh string `json:"name_th"`
}

// CategoryFromDTO converts CategoryDTO to CategoryResponse
func CategoryFromDTO(d dto.CategoryDTO) CategoryResponse {
	return CategoryResponse{
		ID:     d.ID,
		NameEn: d.NameEn,
		NameTh: d.NameTh,
	}
}

// CategoriesToResponse converts slice of DTOs to responses
func CategoriesToResponse(dtos []dto.CategoryDTO) []CategoryResponse {
	responses := make([]CategoryResponse, 0, len(dtos))
	for _, d := range dtos {
		responses = append(responses, CategoryFromDTO(d))
	}
	return responses
}
