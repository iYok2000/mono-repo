package command

import (
	"context"

	"monorepo/backend-go/internal/core/domain/product/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// DeleteProductCommand represents the command to delete a product
type DeleteProductCommand struct {
	ID string
}

// DeleteProductHandler handles the delete product command
type DeleteProductHandler struct {
	repo repository.ServiceRepository
}

// NewDeleteProductHandler creates a new DeleteProductHandler
func NewDeleteProductHandler(repo repository.ServiceRepository) *DeleteProductHandler {
	return &DeleteProductHandler{repo: repo}
}

// Handle executes the delete product command
func (h *DeleteProductHandler) Handle(ctx context.Context, cmd DeleteProductCommand) error {
	if err := h.repo.Delete(ctx, cmd.ID); err != nil {
		return apperrors.NewInternalError("failed to delete product", err)
	}
	return nil
}
