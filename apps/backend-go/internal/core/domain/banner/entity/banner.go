package entity

import (
	"errors"
	"time"
)

// Banner represents a banner entity in the domain
type Banner struct {
	ID           string
	ImageTH      string
	ImageEN      string
	URLTH        string
	URLEN        string
	SegmentTiers []string
	StartDate    time.Time
	EndDate      time.Time
	IsActive     bool
	Priority     int
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// Validate performs business logic validation
func (b *Banner) Validate() error {
	// Date range validation
	if b.EndDate.Before(b.StartDate) || b.EndDate.Equal(b.StartDate) {
		return errors.New("end_date must be after start_date")
	}

	// Priority validation
	if b.Priority < 0 {
		return errors.New("priority must be non-negative")
	}

	return nil
}
