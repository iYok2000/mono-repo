package response

import "monorepo/backend-go/internal/application/product/dto"

// ServiceItemResponse represents the HTTP response for a service item
type ServiceItemResponse struct {
	ID          string   `json:"id"`
	ItemID      string   `json:"item_id"`
	Title       string   `json:"title"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Status      string   `json:"status"`
	Tags        []string `json:"tags"`
	Image       string   `json:"image"`
}

// ServiceItemFromDTO converts ServiceItemDTO to ServiceItemResponse
func ServiceItemFromDTO(d dto.ServiceItemDTO) ServiceItemResponse {
	return ServiceItemResponse{
		ID:          d.ID,
		ItemID:      d.ItemID,
		Title:       d.Title,
		Category:    d.Category,
		Description: d.Description,
		Status:      d.Status,
		Tags:        d.Tags,
		Image:       d.Image,
	}
}

// ServiceItemsToResponse converts slice of DTOs to responses
func ServiceItemsToResponse(dtos []dto.ServiceItemDTO) []ServiceItemResponse {
	responses := make([]ServiceItemResponse, 0, len(dtos))
	for _, d := range dtos {
		responses = append(responses, ServiceItemFromDTO(d))
	}
	return responses
}
