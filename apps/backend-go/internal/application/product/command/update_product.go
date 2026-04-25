package command

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/product/dto"
	"monorepo/backend-go/internal/application/product/validation"
	"monorepo/backend-go/internal/core/domain/product/repository"
	"monorepo/backend-go/internal/core/domain/product/valueobject"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/model"
	apperrors "monorepo/backend-go/pkg/errors"

	"gorm.io/datatypes"
)

// UpdateProductCommand represents the command to update a product
type UpdateProductCommand struct {
	ID          string
	CategoryID  string
	Title       string
	Status      string
	Tags        []string
	Image       string
	Description string

	// New content fields
	MainContent string
	HowToUse    string
	Reference   string
	Example     string
}

// UpdateProductHandler handles the update product command
type UpdateProductHandler struct {
	categoryRepo repository.CategoryRepository
	serviceRepo  repository.ServiceRepository
	validator    *validation.ContentValidator
}

// NewUpdateProductHandler creates a new UpdateProductHandler
func NewUpdateProductHandler(
	categoryRepo repository.CategoryRepository,
	serviceRepo repository.ServiceRepository,
) *UpdateProductHandler {
	return &UpdateProductHandler{
		categoryRepo: categoryRepo,
		serviceRepo:  serviceRepo,
		validator:    validation.NewContentValidator(),
	}
}

// Handle executes the update product command
func (h *UpdateProductHandler) Handle(ctx context.Context, cmd UpdateProductCommand) (*dto.ProductDTO, error) {
	// First, get the existing product to preserve unmodified fields
	existingProduct, err := h.serviceRepo.GetByID(ctx, cmd.ID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get existing product", err)
	}
	if existingProduct == nil {
		return nil, apperrors.NewNotFoundError("product", cmd.ID)
	}

	// Security: Validate and sanitize all inputs
	sanitizedTitle, err := h.validator.ValidateAndSanitizeTitle(cmd.Title)
	if err != nil {
		return nil, apperrors.NewValidationError("title", err.Error())
	}

	sanitizedDesc, err := h.validator.ValidateAndSanitizeDescription(cmd.Description)
	if err != nil {
		return nil, apperrors.NewValidationError("description", err.Error())
	}

	sanitizedImage, err := h.validator.ValidateImageURL(cmd.Image)
	if err != nil {
		return nil, apperrors.NewValidationError("image", err.Error())
	}

	sanitizedTags, err := h.validator.ValidateTags(cmd.Tags)
	if err != nil {
		return nil, apperrors.NewValidationError("tags", err.Error())
	}

	// Sanitize new content fields (XSS protection)
	// Only sanitize if provided (non-empty), otherwise preserve existing
	sanitizedMainContent := existingProduct.Detail.MainContent
	if cmd.MainContent != "" {
		sanitizedMainContent, err = h.validator.SanitizeMainContent(cmd.MainContent)
		if err != nil {
			return nil, apperrors.NewValidationError("main_content", err.Error())
		}
	}

	sanitizedHowToUse := existingProduct.Detail.HowToUse
	if cmd.HowToUse != "" {
		sanitizedHowToUse, err = h.validator.SanitizeHowToUse(cmd.HowToUse)
		if err != nil {
			return nil, apperrors.NewValidationError("how_to_use", err.Error())
		}
	}

	sanitizedReference := existingProduct.Detail.Reference
	if cmd.Reference != "" {
		sanitizedReference, err = h.validator.SanitizeReference(cmd.Reference)
		if err != nil {
			return nil, apperrors.NewValidationError("reference", err.Error())
		}
	}

	sanitizedExample := existingProduct.Detail.Example
	if cmd.Example != "" {
		sanitizedExample, err = h.validator.SanitizeExample(cmd.Example)
		if err != nil {
			return nil, apperrors.NewValidationError("example", err.Error())
		}
	}

	// Validate CategoryID exists (mandatory)
	category, err := h.categoryRepo.GetByID(ctx, cmd.CategoryID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to check category", err)
	}
	if category == nil {
		return nil, apperrors.NewValidationError("category_id", "category does not exist")
	}

	// Validate Status
	if err := h.validator.ValidateStatus(cmd.Status); err != nil {
		return nil, apperrors.NewValidationError("status", err.Error())
	}
	status := valueobject.ServiceStatus(cmd.Status)
	if !status.IsValid() {
		return nil, apperrors.NewValidationError("status", "invalid status value")
	}

	// Validate Tags against predefined list
	if !valueobject.ValidateTags(sanitizedTags) {
		return nil, apperrors.NewValidationError("tags", "invalid tag value")
	}

	// Marshal tags to JSON (SQL injection protection via parameterized queries)
	tagsJSON, err := json.Marshal(sanitizedTags)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to marshal tags", err)
	}

	// Create product model with sanitized data
	product := &model.ProductModel{
		ID:         cmd.ID,
		CategoryID: cmd.CategoryID,
		Title:      sanitizedTitle,
		Status:     cmd.Status,
		Tags:       datatypes.JSON(tagsJSON),
		Image:      sanitizedImage,
	}

	// Create detail model with sanitized content
	detail := &model.ProductDetailModel{
		ProductID:   cmd.ID,
		Description: sanitizedDesc,
		MainContent: sanitizedMainContent,
		HowToUse:    sanitizedHowToUse,
		Reference:   sanitizedReference,
		Example:     sanitizedExample,
	}

	// Update product and detail (using GORM transactions - prevents SQL injection)
	if err := h.serviceRepo.UpdateWithDetail(ctx, product, detail); err != nil {
		return nil, apperrors.NewInternalError("failed to update product", err)
	}

	// Return DTO
	return &dto.ProductDTO{
		ID:          product.ID,
		CategoryID:  product.CategoryID,
		Title:       product.Title,
		Status:      product.Status,
		Tags:        sanitizedTags,
		Image:       product.Image,
		Description: detail.Description,
	}, nil
}
