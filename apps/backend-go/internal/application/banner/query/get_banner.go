package query

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/banner/dto"
	"monorepo/backend-go/internal/core/domain/banner/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// GetBannerHandler handles the get banner by ID query
type GetBannerHandler struct {
	repo repository.BannerRepository
}

// NewGetBannerHandler creates a new GetBannerHandler
func NewGetBannerHandler(repo repository.BannerRepository) *GetBannerHandler {
	return &GetBannerHandler{
		repo: repo,
	}
}

// Handle executes the get banner by ID query
func (h *GetBannerHandler) Handle(ctx context.Context, id string) (*dto.BannerDTO, error) {
	// Fetch banner from repository
	model, err := h.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get banner", err)
	}

	if model == nil {
		return nil, apperrors.NewNotFoundError("banner", "banner not found")
	}

	// Unmarshal segment tiers from JSONB
	var tiers []string
	if err := json.Unmarshal(model.SegmentTiers, &tiers); err != nil {
		// Use empty array if unmarshal fails
		tiers = []string{}
	}

	// Return DTO
	return &dto.BannerDTO{
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
	}, nil
}
