package devtoolkit

import (
	"fmt"

	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/devtoolkit/model"

	"gorm.io/gorm"
)

// AutoMigrate runs database migrations for all devtoolkit tables
func AutoMigrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&model.CategoryModel{},
		&model.DevToolkitModel{},
		&model.DevToolkitDetailModel{},
	); err != nil {
		return fmt.Errorf("auto migrate devtoolkit tables: %w", err)
	}

	return nil
}
