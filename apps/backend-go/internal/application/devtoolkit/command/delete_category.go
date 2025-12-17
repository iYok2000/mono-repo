package command

import (
	"context"

	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// DeleteCategoryCommand represents the command to delete a category
type DeleteCategoryCommand struct {
	ID string
}

// DeleteCategoryHandler handles the delete category command
type DeleteCategoryHandler struct {
	repo repository.CategoryRepository
}

// NewDeleteCategoryHandler creates a new DeleteCategoryHandler
func NewDeleteCategoryHandler(repo repository.CategoryRepository) *DeleteCategoryHandler {
	return &DeleteCategoryHandler{repo: repo}
}

// Handle executes the delete category command
func (h *DeleteCategoryHandler) Handle(ctx context.Context, cmd DeleteCategoryCommand) error {
	// Check if category exists
	category, err := h.repo.GetByID(ctx, cmd.ID)
	if err != nil {
		return apperrors.NewInternalError("failed to get category", err)
	}
	if category == nil {
		return apperrors.NewNotFoundError("category", cmd.ID)
	}

	// Delete category
	if err := h.repo.Delete(ctx, cmd.ID); err != nil {
		return apperrors.NewInternalError("failed to delete category", err)
	}

	return nil
}
