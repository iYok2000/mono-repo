package command

import (
	"context"

	"monorepo/backend-go/internal/application/product/dto"
	"monorepo/backend-go/internal/application/product/validation"
	"monorepo/backend-go/internal/core/domain/product/entity"
	"monorepo/backend-go/internal/core/domain/product/repository"
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
	repo      repository.CategoryRepository
	validator *validation.ContentValidator
}

// NewCreateCategoryHandler creates a new CreateCategoryHandler
func NewCreateCategoryHandler(repo repository.CategoryRepository, validator *validation.ContentValidator) *CreateCategoryHandler {
	return &CreateCategoryHandler{
		repo:      repo,
		validator: validator,
	}
}

// Handle executes the create category command
func (h *CreateCategoryHandler) Handle(ctx context.Context, cmd CreateCategoryCommand) (*dto.CategoryDTO, error) {
	// Security: Validate and sanitize all inputs first (XSS protection)
	sanitizedID, err := h.validator.ValidateAndSanitizeCategoryID(cmd.ID)
	if err != nil {
		return nil, apperrors.NewValidationError("id", err.Error())
	}

	sanitizedNameEn, err := h.validator.ValidateAndSanitizeCategoryName(cmd.NameEn, "name_en")
	if err != nil {
		return nil, apperrors.NewValidationError("name_en", err.Error())
	}

	sanitizedNameTh, err := h.validator.ValidateAndSanitizeCategoryName(cmd.NameTh, "name_th")
	if err != nil {
		return nil, apperrors.NewValidationError("name_th", err.Error())
	}

	// Create domain entity with sanitized data
	category, err := entity.NewCategory(sanitizedID, sanitizedNameEn, sanitizedNameTh)
	if err != nil {
		return nil, apperrors.NewValidationErrorSimple(err.Error())
	}

	// Check if category already exists
	existing, err := h.repo.GetByID(ctx, sanitizedID)
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
