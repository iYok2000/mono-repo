package command

import (
	"context"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/entity"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	apperrors "monorepo/backend-go/pkg/errors"
)

// CreateCategoryCommand represents the command to create a category
type CreateCategoryCommand struct {
	ID     string
	NameEn string
	NameTh string
}

// CreateCategoryHandler handles the create category command
type CreateCategoryHandler struct {
	repo repository.CategoryRepository
}

// NewCreateCategoryHandler creates a new CreateCategoryHandler
func NewCreateCategoryHandler(repo repository.CategoryRepository) *CreateCategoryHandler {
	return &CreateCategoryHandler{repo: repo}
}

// Handle executes the create category command
func (h *CreateCategoryHandler) Handle(ctx context.Context, cmd CreateCategoryCommand) (*dto.CategoryDTO, error) {
	// Create domain entity with validation
	category, err := entity.NewCategory(cmd.ID, cmd.NameEn, cmd.NameTh)
	if err != nil {
		return nil, apperrors.NewValidationErrorSimple(err.Error())
	}

	// Check if category already exists
	existing, err := h.repo.GetByID(ctx, cmd.ID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to check existing category", err)
	}
	if existing != nil {
		return nil, apperrors.NewConflictError("category", "category with this ID already exists")
	}

	// Persist
	if err := h.repo.Create(ctx, category); err != nil {
		return nil, apperrors.NewInternalError("failed to create category", err)
	}

	// Return DTO
	result := dto.CategoryToDTO(category)
	return &result, nil
}
