package validation

import (
	"errors"
	"fmt"
	"html"
	"net/url"
	"regexp"
	"strings"
	"time"
)

// Field length limits (performance & security)
const (
	MaxIDLength         = 100
	MaxImagePathLength  = 500
	MaxURLLength        = 2048
	MaxSegmentTiers     = 10
)

var (
	ErrEmptyField       = errors.New("field cannot be empty")
	ErrFieldTooLong     = errors.New("field exceeds maximum length")
	ErrInvalidFormat    = errors.New("invalid format")
	ErrInvalidDateRange = errors.New("end_date must be after start_date")
	ErrInvalidTier      = errors.New("invalid segment tier")
)

// BannerValidator handles validation and sanitization for banner fields
type BannerValidator struct{}

// NewBannerValidator creates a new banner validator
func NewBannerValidator() *BannerValidator {
	return &BannerValidator{}
}

// ValidateAndSanitizeID validates banner ID
// ID should be alphanumeric, dash, underscore only
func (v *BannerValidator) ValidateAndSanitizeID(id string) (string, error) {
	id = strings.TrimSpace(id)

	if id == "" {
		return "", fmt.Errorf("id: %w", ErrEmptyField)
	}

	if len(id) > MaxIDLength {
		return "", fmt.Errorf("id: %w (max %d)", ErrFieldTooLong, MaxIDLength)
	}

	// Only allow alphanumeric, dash, underscore
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_-]+$`, id)
	if !matched {
		return "", fmt.Errorf("id: invalid characters (only alphanumeric, dash, underscore allowed)")
	}

	return id, nil
}

// ValidateImagePath validates uploaded file path
func (v *BannerValidator) ValidateImagePath(path string) (string, error) {
	path = strings.TrimSpace(path)

	if path == "" {
		return "", fmt.Errorf("image_path: %w", ErrEmptyField)
	}

	if len(path) > MaxImagePathLength {
		return "", fmt.Errorf("image_path: %w (max %d)", ErrFieldTooLong, MaxImagePathLength)
	}

	// Path traversal prevention
	if strings.Contains(path, "..") {
		return "", fmt.Errorf("image_path: path traversal detected")
	}

	// Must start with /uploads/ or be a valid HTTP URL
	if !strings.HasPrefix(path, "/uploads/") &&
		!strings.HasPrefix(path, "http://") &&
		!strings.HasPrefix(path, "https://") {
		return "", fmt.Errorf("image_path: must be upload path or valid URL")
	}

	return path, nil
}

// ValidateURL validates redirect URL
func (v *BannerValidator) ValidateURL(urlStr string) (string, error) {
	urlStr = strings.TrimSpace(urlStr)

	if urlStr == "" {
		return "", fmt.Errorf("url: %w", ErrEmptyField)
	}

	if len(urlStr) > MaxURLLength {
		return "", fmt.Errorf("url: %w (max %d)", ErrFieldTooLong, MaxURLLength)
	}

	// Parse URL
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return "", fmt.Errorf("url: %w", ErrInvalidFormat)
	}

	// Must have scheme and host (prevent javascript:, data:)
	if parsedURL.Scheme == "" || parsedURL.Host == "" {
		return "", fmt.Errorf("url: must have scheme and host")
	}

	// Only allow http/https
	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		return "", fmt.Errorf("url: only http/https allowed")
	}

	// HTML escape as defense in depth
	return html.EscapeString(urlStr), nil
}

// ValidateSegmentTiers validates segment tier array
func (v *BannerValidator) ValidateSegmentTiers(tiers []string, predefinedTiers []string) ([]string, error) {
	if len(tiers) == 0 {
		return nil, fmt.Errorf("segment_tiers: at least one tier required")
	}

	if len(tiers) > MaxSegmentTiers {
		return nil, fmt.Errorf("segment_tiers: too many tiers (max %d)", MaxSegmentTiers)
	}

	// Create map for O(1) lookup
	tierMap := make(map[string]bool)
	for _, tier := range predefinedTiers {
		tierMap[tier] = true
	}

	sanitized := make([]string, 0, len(tiers))
	seen := make(map[string]bool)

	for _, tier := range tiers {
		tier = strings.TrimSpace(tier)
		if tier == "" {
			continue
		}

		// Check if valid tier
		if !tierMap[tier] {
			return nil, fmt.Errorf("segment_tiers: invalid tier '%s'", tier)
		}

		// Prevent duplicates
		if seen[tier] {
			continue
		}

		seen[tier] = true
		sanitized = append(sanitized, tier)
	}

	if len(sanitized) == 0 {
		return nil, fmt.Errorf("segment_tiers: at least one valid tier required")
	}

	return sanitized, nil
}

// ValidateDateRange validates start and end dates
func (v *BannerValidator) ValidateDateRange(startDate, endDate time.Time) error {
	if endDate.Before(startDate) || endDate.Equal(startDate) {
		return ErrInvalidDateRange
	}
	return nil
}

// ValidatePriority validates priority value
func (v *BannerValidator) ValidatePriority(priority int) error {
	if priority < 0 {
		return fmt.Errorf("priority: must be non-negative")
	}
	return nil
}
