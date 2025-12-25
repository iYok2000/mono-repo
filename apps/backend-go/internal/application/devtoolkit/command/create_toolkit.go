package command

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/application/devtoolkit/validation"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	"monorepo/backend-go/internal/core/domain/devtoolkit/valueobject"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
	apperrors "monorepo/backend-go/pkg/errors"

	"gorm.io/datatypes"
)

// CreateToolkitCommand represents the command to create a toolkit
type CreateToolkitCommand struct {
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

// CreateToolkitHandler handles the create toolkit command
type CreateToolkitHandler struct {
	categoryRepo repository.CategoryRepository
	serviceRepo  repository.ServiceRepository
	validator    *validation.ContentValidator
}

// NewCreateToolkitHandler creates a new CreateToolkitHandler
func NewCreateToolkitHandler(
	categoryRepo repository.CategoryRepository,
	serviceRepo repository.ServiceRepository,
) *CreateToolkitHandler {
	return &CreateToolkitHandler{
		categoryRepo: categoryRepo,
		serviceRepo:  serviceRepo,
		validator:    validation.NewContentValidator(),
	}
}

// Handle executes the create toolkit command
func (h *CreateToolkitHandler) Handle(ctx context.Context, cmd CreateToolkitCommand) (*dto.DevToolkitDTO, error) {
	// Security: Validate and sanitize all inputs
	sanitizedID, err := h.validator.ValidateAndSanitizeID(cmd.ID)
	if err != nil {
		return nil, apperrors.NewValidationError("id", err.Error())
	}

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
	sanitizedMainContent, err := h.validator.SanitizeMainContent(cmd.MainContent)
	if err != nil {
		return nil, apperrors.NewValidationError("main_content", err.Error())
	}

	sanitizedHowToUse, err := h.validator.SanitizeHowToUse(cmd.HowToUse)
	if err != nil {
		return nil, apperrors.NewValidationError("how_to_use", err.Error())
	}

	sanitizedReference, err := h.validator.SanitizeReference(cmd.Reference)
	if err != nil {
		return nil, apperrors.NewValidationError("reference", err.Error())
	}

	sanitizedExample, err := h.validator.SanitizeExample(cmd.Example)
	if err != nil {
		return nil, apperrors.NewValidationError("example", err.Error())
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

	// Create toolkit model with sanitized data
	toolkit := &model.DevToolkitModel{
		ID:         sanitizedID,
		CategoryID: cmd.CategoryID,
		Title:      sanitizedTitle,
		Status:     cmd.Status,
		Tags:       datatypes.JSON(tagsJSON),
		Image:      sanitizedImage,
	}

	// Create detail model with sanitized content
	detail := &model.DevToolkitDetailModel{
		ToolkitID:   sanitizedID,
		Description: sanitizedDesc,
		MainContent: sanitizedMainContent,
		HowToUse:    sanitizedHowToUse,
		Reference:   sanitizedReference,
		Example:     sanitizedExample,
	}

	// Persist toolkit and detail (using GORM transactions - prevents SQL injection)
	if err := h.serviceRepo.CreateWithDetail(ctx, toolkit, detail); err != nil {
		return nil, apperrors.NewInternalError("failed to create toolkit", err)
	}

	// Return DTO
	return &dto.DevToolkitDTO{
		ID:          toolkit.ID,
		CategoryID:  toolkit.CategoryID,
		Title:       toolkit.Title,
		Status:      toolkit.Status,
		Tags:        sanitizedTags,
		Image:       toolkit.Image,
		Description: detail.Description,
	}, nil
}
