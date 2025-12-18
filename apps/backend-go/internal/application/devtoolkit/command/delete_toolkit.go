package command

import (
	"context"

	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// DeleteToolkitCommand represents the command to delete a toolkit
type DeleteToolkitCommand struct {
	ID string
}

// DeleteToolkitHandler handles the delete toolkit command
type DeleteToolkitHandler struct {
	repo repository.ServiceRepository
}

// NewDeleteToolkitHandler creates a new DeleteToolkitHandler
func NewDeleteToolkitHandler(repo repository.ServiceRepository) *DeleteToolkitHandler {
	return &DeleteToolkitHandler{repo: repo}
}

// Handle executes the delete toolkit command
func (h *DeleteToolkitHandler) Handle(ctx context.Context, cmd DeleteToolkitCommand) error {
	if err := h.repo.Delete(ctx, cmd.ID); err != nil {
		return apperrors.NewInternalError("failed to delete toolkit", err)
	}
	return nil
}
