package product

import (
	"fmt"

	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/product/model"

	"gorm.io/gorm"
)

// AutoMigrate runs database migrations for all product tables
func AutoMigrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&model.CategoryModel{},
		&model.ProductModel{},
		&model.ProductDetailModel{},
	); err != nil {
		return fmt.Errorf("auto migrate product tables: %w", err)
	}

	return nil
}
