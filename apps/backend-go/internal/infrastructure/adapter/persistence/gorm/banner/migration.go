package banner

import (
	"fmt"

	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/banner/model"

	"gorm.io/gorm"
)

// AutoMigrate runs database migrations for banner tables
func AutoMigrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&model.BannerModel{},
	); err != nil {
		return fmt.Errorf("auto migrate banner tables: %w", err)
	}

	// Add database constraints using raw SQL (GORM doesn't support CHECK constraints in AutoMigrate)
	// Note: These will be idempotent - won't fail if already exist
	constraints := []string{
		// Check constraint: end_date must be after start_date
		`DO $$ BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conname = 'check_end_after_start'
			) THEN
				ALTER TABLE banners ADD CONSTRAINT check_end_after_start
				CHECK (end_date > start_date);
			END IF;
		END $$;`,

		// Check constraint: priority must be non-negative
		`DO $$ BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conname = 'check_priority_positive'
			) THEN
				ALTER TABLE banners ADD CONSTRAINT check_priority_positive
				CHECK (priority >= 0);
			END IF;
		END $$;`,
	}

	for _, constraint := range constraints {
		if err := db.Exec(constraint).Error; err != nil {
			return fmt.Errorf("add constraint: %w", err)
		}
	}

	return nil
}
