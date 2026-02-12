package entity

import (
	"fmt"
	"strings"
)

// Category represents a category aggregate root in the domain
// This is a RICH domain model with encapsulated business logic
type Category struct {
	id     string
	nameEn string
	nameTh string
}

// NewCategory creates a new Category with validation
// This is a factory method that enforces business rules
func NewCategory(id, nameEn, nameTh string) (*Category, error) {
	if err := validateCategoryFields(id, nameEn, nameTh); err != nil {
		return nil, err
	}

	return &Category{
		id:     strings.TrimSpace(id),
		nameEn: strings.TrimSpace(nameEn),
		nameTh: strings.TrimSpace(nameTh),
	}, nil
}

// ReconstructCategory reconstructs a Category from persistence layer
// Used by repository when loading from database (skip validation)
func ReconstructCategory(id, nameEn, nameTh string) *Category {
	return &Category{
		id:     id,
		nameEn: nameEn,
		nameTh: nameTh,
	}
}

// Getters - encapsulation with immutability
func (c *Category) ID() string {
	return c.id
}

func (c *Category) NameEn() string {
	return c.nameEn
}

func (c *Category) NameTh() string {
	return c.nameTh
}

// UpdateNames updates category names with validation
// This is domain behavior - business logic lives here
func (c *Category) UpdateNames(nameEn, nameTh string) error {
	nameEn = strings.TrimSpace(nameEn)
	nameTh = strings.TrimSpace(nameTh)

	if nameEn == "" || nameTh == "" {
		return fmt.Errorf("category names cannot be empty")
	}

	if len(nameEn) > 100 {
		return fmt.Errorf("english name too long (max 100 characters)")
	}

	if len(nameTh) > 100 {
		return fmt.Errorf("thai name too long (max 100 characters)")
	}

	c.nameEn = nameEn
	c.nameTh = nameTh
	return nil
}

// validateCategoryFields validates all required fields
func validateCategoryFields(id, nameEn, nameTh string) error {
	id = strings.TrimSpace(id)
	nameEn = strings.TrimSpace(nameEn)
	nameTh = strings.TrimSpace(nameTh)

	if id == "" {
		return fmt.Errorf("category id is required")
	}

	if nameEn == "" {
		return fmt.Errorf("category english name is required")
	}

	if nameTh == "" {
		return fmt.Errorf("category thai name is required")
	}

	if len(id) > 50 {
		return fmt.Errorf("category id too long (max 50 characters)")
	}

	if len(nameEn) > 100 {
		return fmt.Errorf("english name too long (max 100 characters)")
	}

	if len(nameTh) > 100 {
		return fmt.Errorf("thai name too long (max 100 characters)")
	}

	if strings.Contains(id, " ") {
		return fmt.Errorf("category id cannot contain spaces")
	}

	return nil
}
