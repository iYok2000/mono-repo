package postgres

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// NewConnection creates a new PostgreSQL database connection using GORM
func NewConnection(databaseURL string) (*gorm.DB, error) {
	if databaseURL == "" {
		return nil, fmt.Errorf("database URL is empty")
	}

	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		// Add config options here if needed
		// e.g., Logger, PrepareStmt, etc.
	})
	if err != nil {
		return nil, fmt.Errorf("failed to open postgres connection: %w", err)
	}

	return db, nil
}
