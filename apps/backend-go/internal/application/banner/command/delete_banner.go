package command

import (
	"context"

	"monorepo/backend-go/internal/core/domain/banner/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// DeleteBannerCommand represents the command to delete a banner
type DeleteBannerCommand struct {
	ID string
}

// DeleteBannerHandler handles the delete banner command
type DeleteBannerHandler struct {
	repo repository.BannerRepository
}

// NewDeleteBannerHandler creates a new DeleteBannerHandler
func NewDeleteBannerHandler(repo repository.BannerRepository) *DeleteBannerHandler {
	return &DeleteBannerHandler{
		repo: repo,
	}
}

// Handle executes the delete banner command
func (h *DeleteBannerHandler) Handle(ctx context.Context, cmd DeleteBannerCommand) error {
	// Check if banner exists
	existing, err := h.repo.GetByID(ctx, cmd.ID)
	if err != nil {
		return apperrors.NewInternalError("failed to get banner", err)
	}
	if existing == nil {
		return apperrors.NewNotFoundError("banner", "banner not found")
	}

	// Delete banner
	if err := h.repo.Delete(ctx, cmd.ID); err != nil {
		return apperrors.NewInternalError("failed to delete banner", err)
	}

	return nil
}
