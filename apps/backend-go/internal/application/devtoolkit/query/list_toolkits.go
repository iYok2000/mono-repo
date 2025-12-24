package query

import (
	"context"
	"encoding/json"

	"monorepo/backend-go/internal/application/devtoolkit/dto"
	"monorepo/backend-go/internal/core/domain/devtoolkit/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"
	apperrors "monorepo/backend-go/pkg/errors"
)

// ListToolkitsHandler handles listing all toolkits
type ListToolkitsHandler struct {
	repo repository.ServiceRepository
}

// NewListToolkitsHandler creates a new ListToolkitsHandler
func NewListToolkitsHandler(repo repository.ServiceRepository) *ListToolkitsHandler {
	return &ListToolkitsHandler{repo: repo}
}

// Handle executes the list toolkits query
func (h *ListToolkitsHandler) Handle(ctx context.Context) ([]dto.DevToolkitDTO, error) {
	// Get domain entities
	services, err := h.repo.ListServices(ctx)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to list toolkits", err)
	}

	// Convert to DTOs
	dtos := make([]dto.DevToolkitDTO, 0, len(services))
	for _, s := range services {
		// Parse tags from JSON
		var tags []string
		// Tags might be empty, handle gracefully
		if len(s.Tags()) > 0 {
			tags = s.Tags()
		}

		dtos = append(dtos, dto.DevToolkitDTO{
			ID:          s.ID(),
			CategoryID:  s.Category(),
			Title:       s.Title(),
			Status:      s.Status().String(),
			Tags:        tags,
			Image:       s.Image(),
			Description: s.Description(),
		})
	}

	return dtos, nil
}

// GetToolkitHandler handles getting a single toolkit by ID
type GetToolkitHandler struct {
	repo repository.ServiceRepository
}

// NewGetToolkitHandler creates a new GetToolkitHandler
func NewGetToolkitHandler(repo repository.ServiceRepository) *GetToolkitHandler {
	return &GetToolkitHandler{repo: repo}
}

// Handle executes the get toolkit query
func (h *GetToolkitHandler) Handle(ctx context.Context, id string) (*dto.DevToolkitDetailDTO, error) {
	toolkit, err := h.repo.GetByID(ctx, id)
	if err != nil {
		return nil, apperrors.NewInternalError("failed to get toolkit", err)
	}
	if toolkit == nil {
		return nil, apperrors.NewNotFoundError("toolkit", "toolkit not found")
	}

	// Parse tags from JSON
	var tags []string
	if len(toolkit.Tags) > 0 {
		if err := json.Unmarshal([]byte(toolkit.Tags), &tags); err != nil {
			tags = []string{}
		}
	}

	// Get content fields from detail
	description := ""
	mainContent := ""
	howToUse := ""
	reference := ""
	example := ""
	if toolkit.Detail != nil {
		description = toolkit.Detail.Description
		mainContent = toolkit.Detail.MainContent
		howToUse = toolkit.Detail.HowToUse
		reference = toolkit.Detail.Reference
		example = toolkit.Detail.Example
	}

	return &dto.DevToolkitDetailDTO{
		ID:          toolkit.ID,
		CategoryID:  toolkit.CategoryID,
		Title:       toolkit.Title,
		Status:      toolkit.Status,
		Tags:        tags,
		Image:       toolkit.Image,
		Description: description,
		MainContent: mainContent,
		HowToUse:    howToUse,
		Reference:   reference,
		Example:     example,
	}, nil
}

// GetToolkitsByModel returns raw models (for internal use)
func GetToolkitsByModel(repo repository.ServiceRepository) func(ctx context.Context) ([]model.DevToolkitModel, error) {
	return func(ctx context.Context) ([]model.DevToolkitModel, error) {
		// This is a helper function if needed elsewhere
		return nil, nil
	}
}
