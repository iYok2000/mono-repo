package query

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/banner/dto"
	"monorepo/backend-go/internal/core/domain/banner/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// ListBannersHandler handles the list banners query
type ListBannersHandler struct {
	repo repository.BannerRepository
}

// NewListBannersHandler creates a new ListBannersHandler
func NewListBannersHandler(repo repository.BannerRepository) *ListBannersHandler {
	return &ListBannersHandler{
		repo: repo,
	}
}

// Handle executes the list banners query with optional filters
func (h *ListBannersHandler) Handle(ctx context.Context, filters repository.ListFilters) ([]*dto.BannerDTO, error) {
	// Fetch banners from repository
	models, err := h.repo.List(ctx, filters)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to list banners", err)
	}

	// Convert models to DTOs
	dtos := make([]*dto.BannerDTO, 0, len(models))
	for _, model := range models {
		// Unmarshal segment tiers from JSONB
		var tiers []string
		if err := json.Unmarshal(model.SegmentTiers, &tiers); err != nil {
			// Skip malformed data or use empty array
			tiers = []string{}
		}

		dtos = append(dtos, &dto.BannerDTO{
			ID:           model.ID,
			ImageTH:      model.ImageTH,
			ImageEN:      model.ImageEN,
			URLTH:        model.URLTH,
			URLEN:        model.URLEN,
			SegmentTiers: tiers,
			StartDate:    model.StartDate,
			EndDate:      model.EndDate,
			IsActive:     model.IsActive,
			Priority:     model.Priority,
			CreatedAt:    model.CreatedAt,
			UpdatedAt:    model.UpdatedAt,
		})
	}

	return dtos, nil
}
