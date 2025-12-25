package command

import (
	"context"

	"monorepo/backend-go/internal/core/domain/banner/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// PriorityUpdate represents a priority update for a single banner
type PriorityUpdate struct {
	ID       string `json:"id" binding:"required"`
	Priority int    `json:"priority" binding:"required,min=0"`
}

// ReorderBannersCommand represents the command to reorder multiple banners
type ReorderBannersCommand struct {
	Updates []PriorityUpdate `json:"updates" binding:"required,min=1,dive"`
}

// ReorderBannersHandler handles the reorder banners command
type ReorderBannersHandler struct {
	repo repository.BannerRepository
}

// NewReorderBannersHandler creates a new ReorderBannersHandler
func NewReorderBannersHandler(repo repository.BannerRepository) *ReorderBannersHandler {
	return &ReorderBannersHandler{
		repo: repo,
	}
}

// Handle executes the reorder banners command
func (h *ReorderBannersHandler) Handle(ctx context.Context, cmd ReorderBannersCommand) error {
	// Validate that all banner IDs exist
	for _, update := range cmd.Updates {
		banner, err := h.repo.GetByID(ctx, update.ID)
		if err != nil {
			return apperrors.NewInternalError("failed to get banner", err)
		}
		if banner == nil {
			return apperrors.NewNotFoundError("banner", update.ID)
		}
	}

	// Convert command updates to repository updates
	repoUpdates := make([]repository.PriorityUpdate, len(cmd.Updates))
	for i, update := range cmd.Updates {
		repoUpdates[i] = repository.PriorityUpdate{
			ID:       update.ID,
			Priority: update.Priority,
		}
	}

	// Batch update all priorities in a single operation
	if err := h.repo.UpdatePriorities(ctx, repoUpdates); err != nil {
		return apperrors.NewInternalError("failed to update banner priorities", err)
	}

	return nil
}
