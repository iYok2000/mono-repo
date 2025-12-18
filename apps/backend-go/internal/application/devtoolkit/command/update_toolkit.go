package command

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	"monorepo/backend-go/internal/core/domain/devtoolkit/valueobject"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
	apperrors "monorepo/backend-go/pkg/errors"

	"gorm.io/datatypes"
)

// UpdateToolkitCommand represents the command to update a toolkit
type UpdateToolkitCommand struct {
	ID          string
	CategoryID  string
	Title       string
	Status      string
	Tags        []string
	Image       string
	Description string
}

// UpdateToolkitHandler handles the update toolkit command
type UpdateToolkitHandler struct {
	categoryRepo repository.CategoryRepository
	serviceRepo  repository.ServiceRepository
}

// NewUpdateToolkitHandler creates a new UpdateToolkitHandler
func NewUpdateToolkitHandler(
	categoryRepo repository.CategoryRepository,
	serviceRepo repository.ServiceRepository,
) *UpdateToolkitHandler {
	return &UpdateToolkitHandler{
		categoryRepo: categoryRepo,
		serviceRepo:  serviceRepo,
	}
}

// Handle executes the update toolkit command
func (h *UpdateToolkitHandler) Handle(ctx context.Context, cmd UpdateToolkitCommand) (*dto.DevToolkitDTO, error) {
	// Validate CategoryID exists (mandatory)
	category, err := h.categoryRepo.GetByID(ctx, cmd.CategoryID)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to check category", err)
	}
	if category == nil {
		return nil, apperrors.NewValidationError("category_id", "category does not exist")
	}

	// Validate Status
	status := valueobject.ServiceStatus(cmd.Status)
	if !status.IsValid() {
		return nil, apperrors.NewValidationError("status", "invalid status value")
	}

	// Validate Tags
	if !valueobject.ValidateTags(cmd.Tags) {
		return nil, apperrors.NewValidationError("tags", "invalid tag value")
	}

	// Marshal tags to JSON
	tagsJSON, err := json.Marshal(cmd.Tags)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to marshal tags", err)
	}

	// Create toolkit model
	toolkit := &model.DevToolkitModel{
		ID:         cmd.ID,
		CategoryID: cmd.CategoryID,
		Title:      cmd.Title,
		Status:     cmd.Status,
		Tags:       datatypes.JSON(tagsJSON),
		Image:      cmd.Image,
	}

	// Create detail model
	detail := &model.DevToolkitDetailModel{
		ToolkitID:   cmd.ID,
		Description: cmd.Description,
	}

	// Update toolkit and detail
	if err := h.serviceRepo.UpdateWithDetail(ctx, toolkit, detail); err != nil {
		return nil, apperrors.NewInternalError("failed to update toolkit", err)
	}

	// Return DTO
	return &dto.DevToolkitDTO{
		ID:          toolkit.ID,
		CategoryID:  toolkit.CategoryID,
		Title:       toolkit.Title,
		Status:      toolkit.Status,
		Tags:        cmd.Tags,
		Image:       toolkit.Image,
		Description: detail.Description,
	}, nil
}
