package homesettings

import (
	"context"
	"errors"

	"monorepo/backend-go/internal/core/domain/homesettings/entity"
	"monorepo/backend-go/internal/core/domain/homesettings/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/homesettings/model"

	"gorm.io/gorm"
)

// homeSettingsRepositoryImpl implements the HomeSettingsRepository interface
type homeSettingsRepositoryImpl struct {
	db *gorm.DB
}

// NewHomeSettingsRepository creates a new HomeSettingsRepository
func NewHomeSettingsRepository(db *gorm.DB) repository.HomeSettingsRepository {
	return &homeSettingsRepositoryImpl{db: db}
}

// Get retrieves the home settings
func (r *homeSettingsRepositoryImpl) Get(ctx context.Context) (*entity.HomeSettings, error) {
	var dbModel model.HomeSettingsModel

	err := r.db.WithContext(ctx).
		Where("id = ?", "default").
		First(&dbModel).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create default settings if not exist
			dbModel = model.HomeSettingsModel{
				ID: "default",
				// All fields will use their GORM default values
			}
			if err := r.db.WithContext(ctx).Create(&dbModel).Error; err != nil {
				return nil, err
			}
		} else {
			return nil, err
		}
	}

	return model.ToEntity(&dbModel), nil
}

// Update updates the home settings
func (r *homeSettingsRepositoryImpl) Update(ctx context.Context, settings *entity.HomeSettings) error {
	dbModel := model.FromEntity(settings)
	dbModel.ID = "default" // Ensure single record

	return r.db.WithContext(ctx).
		Model(&model.HomeSettingsModel{}).
		Where("id = ?", "default").
		Select("*").
		Updates(dbModel).Error
}
