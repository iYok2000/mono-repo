package command

import (
	"context"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// UpdateCategoryCommand represents the command to update a category
type UpdateCategoryCommand struct {
	ID     string
	NameEn string
	NameTh string
}

// UpdateCategoryHandler handles the update category command
type UpdateCategoryHandler struct {
	repo repository.CategoryRepository
}

// NewUpdateCategoryHandler creates a new UpdateCategoryHandler
func NewUpdateCategoryHandler(repo repository.CategoryRepository) *UpdateCategoryHandler {
	return &UpdateCategoryHandler{repo: repo}
}

// Handle executes the update category command
func (h *UpdateCategoryHandler) Handle(ctx context.Context, cmd UpdateCategoryCommand) (*dto.CategoryDTO, error) {
	// Get existing category
	category, err := h.repo.GetByID(ctx, cmd.ID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get category", err)
	}
	if category == nil {
		return nil, apperrors.NewNotFoundError("category", cmd.ID)
	}

	// Update names with domain validation
	if err := category.UpdateNames(cmd.NameEn, cmd.NameTh); err != nil {
		return nil, apperrors.NewValidationErrorSimple(err.Error())
	}

	// Persist changes
	if err := h.repo.Update(ctx, category); err != nil {
		return nil, apperrors.NewInternalError("failed to update category", err)
	}

	// Return DTO
	result := dto.CategoryToDTO(category)
	return &result, nil
}
