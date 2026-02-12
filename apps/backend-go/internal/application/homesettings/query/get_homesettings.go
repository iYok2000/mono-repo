package query

import (
	"context"

	"monorepo/backend-go/internal/application/homesettings/dto"
	"monorepo/backend-go/internal/application/homesettings/mapper"
	"monorepo/backend-go/internal/core/domain/homesettings/repository"
)

// GetHomeSettingsHandler handles fetching home settings
type GetHomeSettingsHandler struct {
	repo repository.HomeSettingsRepository
}

// NewGetHomeSettingsHandler creates a new GetHomeSettingsHandler
func NewGetHomeSettingsHandler(repo repository.HomeSettingsRepository) *GetHomeSettingsHandler {
	return &GetHomeSettingsHandler{repo: repo}
}

// Handle executes the query to get home settings
func (h *GetHomeSettingsHandler) Handle(ctx context.Context) (*dto.HomeSettingsDTO, error) {
	settings, err := h.repo.Get(ctx)
	if err != nil {
		return nil, err
	}

	return mapper.ToDTO(settings), nil
}
