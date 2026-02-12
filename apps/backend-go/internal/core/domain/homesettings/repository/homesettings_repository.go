package repository

import (
	"context"

	"monorepo/backend-go/internal/core/domain/homesettings/entity"
)

// HomeSettingsRepository defines the interface for home settings persistence
type HomeSettingsRepository interface {
	// Get retrieves the home settings (single record with id='default')
	Get(ctx context.Context) (*entity.HomeSettings, error)

	// Update updates the home settings
	Update(ctx context.Context, settings *entity.HomeSettings) error
}
