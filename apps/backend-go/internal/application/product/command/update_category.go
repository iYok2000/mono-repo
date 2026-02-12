package command

import (
	"context"

	"monorepo/backend-go/internal/application/product/dto"
	"monorepo/backend-go/internal/application/product/validation"
	"monorepo/backend-go/internal/core/domain/product/repository"
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
	repo      repository.CategoryRepository
	validator *validation.ContentValidator
}

// NewUpdateCategoryHandler creates a new UpdateCategoryHandler
func NewUpdateCategoryHandler(repo repository.CategoryRepository, validator *validation.ContentValidator) *UpdateCategoryHandler {
	return &UpdateCategoryHandler{
		repo:      repo,
		validator: validator,
	}
}

// Handle executes the update category command
func (h *UpdateCategoryHandler) Handle(ctx context.Context, cmd UpdateCategoryCommand) (*dto.CategoryDTO, error) {
	// Security: Validate and sanitize ID first
	sanitizedID, err := h.validator.ValidateAndSanitizeCategoryID(cmd.ID)
	if err != nil {
		return nil, apperrors.NewValidationError("id", err.Error())
	}

	// Security: Validate and sanitize names (XSS protection)
	sanitizedNameEn, err := h.validator.ValidateAndSanitizeCategoryName(cmd.NameEn, "name_en")
	if err != nil {
		return nil, apperrors.NewValidationError("name_en", err.Error())
	}

	sanitizedNameTh, err := h.validator.ValidateAndSanitizeCategoryName(cmd.NameTh, "name_th")
	if err != nil {
		return nil, apperrors.NewValidationError("name_th", err.Error())
	}

	// Get existing category
	category, err := h.repo.GetByID(ctx, sanitizedID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get category", err)
	}
	if category == nil {
		return nil, apperrors.NewNotFoundError("category", sanitizedID)
	}

	// Update names with sanitized data and domain validation
	if err := category.UpdateNames(sanitizedNameEn, sanitizedNameTh); err != nil {
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
