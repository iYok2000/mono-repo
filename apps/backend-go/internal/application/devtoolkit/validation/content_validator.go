package validation

import (
	"errors"
	"fmt"
	"html"
	"regexp"
	"strings"
	"unicode/utf8"
)

// Content field length limits (performance & security)
const (
	MaxTitleLength       = 255
	MaxDescriptionLength = 5000   // ~5KB
	MaxMainContentLength = 50000  // ~50KB for articles
	MaxHowToUseLength    = 10000  // ~10KB
	MaxReferenceLength   = 5000   // ~5KB
	MaxExampleLength     = 20000  // ~20KB for code examples
	MaxImageURLLength    = 2048   // Standard URL limit
	MaxIDLength          = 100
	MaxTagCount          = 10
	MaxTagLength         = 50
)

var (
	ErrEmptyField        = errors.New("field cannot be empty")
	ErrFieldTooLong      = errors.New("field exceeds maximum length")
	ErrInvalidCharacters = errors.New("field contains invalid characters")
	ErrTooManyTags       = errors.New("too many tags")
	ErrInvalidFormat     = errors.New("invalid format")
)

// ContentValidator handles validation and sanitization
type ContentValidator struct{}

// NewContentValidator creates a new content validator
func NewContentValidator() *ContentValidator {
	return &ContentValidator{}
}

// ValidateAndSanitizeID validates and sanitizes toolkit ID
// ID should be alphanumeric, dash, underscore only
func (v *ContentValidator) ValidateAndSanitizeID(id string) (string, error) {
	id = strings.TrimSpace(id)

	if id == "" {
		return "", fmt.Errorf("id: %w", ErrEmptyField)
	}

	if utf8.RuneCountInString(id) > MaxIDLength {
		return "", fmt.Errorf("id: %w (max %d)", ErrFieldTooLong, MaxIDLength)
	}

	// Only allow alphanumeric, dash, underscore
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_-]+$`, id)
	if !matched {
		return "", fmt.Errorf("id: %w (only alphanumeric, dash, underscore allowed)", ErrInvalidCharacters)
	}

	return id, nil
}

// ValidateAndSanitizeTitle validates and sanitizes title
func (v *ContentValidator) ValidateAndSanitizeTitle(title string) (string, error) {
	title = strings.TrimSpace(title)

	if title == "" {
		return "", fmt.Errorf("title: %w", ErrEmptyField)
	}

	if utf8.RuneCountInString(title) > MaxTitleLength {
		return "", fmt.Errorf("title: %w (max %d)", ErrFieldTooLong, MaxTitleLength)
	}

	// HTML escape to prevent XSS
	title = html.EscapeString(title)

	return title, nil
}

// ValidateAndSanitizeDescription validates basic description
func (v *ContentValidator) ValidateAndSanitizeDescription(desc string) (string, error) {
	desc = strings.TrimSpace(desc)

	if desc == "" {
		return "", fmt.Errorf("description: %w", ErrEmptyField)
	}

	if utf8.RuneCountInString(desc) > MaxDescriptionLength {
		return "", fmt.Errorf("description: %w (max %d)", ErrFieldTooLong, MaxDescriptionLength)
	}

	// HTML escape to prevent XSS
	desc = html.EscapeString(desc)

	return desc, nil
}

// SanitizeMarkdownContent sanitizes markdown content
// Allows markdown but escapes dangerous HTML
func (v *ContentValidator) SanitizeMarkdownContent(content string, fieldName string, maxLength int) (string, error) {
	content = strings.TrimSpace(content)

	// Empty is allowed for optional fields
	if content == "" {
		return "", nil
	}

	if utf8.RuneCountInString(content) > maxLength {
		return "", fmt.Errorf("%s: %w (max %d)", fieldName, ErrFieldTooLong, maxLength)
	}

	// Remove dangerous HTML tags but keep markdown safe
	// We'll rely on frontend markdown parser to render safely
	// Here we just remove script tags and other dangerous elements
	content = v.removeDangerousTags(content)

	return content, nil
}

// SanitizeMainContent sanitizes main article content
func (v *ContentValidator) SanitizeMainContent(content string) (string, error) {
	return v.SanitizeMarkdownContent(content, "main_content", MaxMainContentLength)
}

// SanitizeHowToUse sanitizes how-to-use content
func (v *ContentValidator) SanitizeHowToUse(content string) (string, error) {
	return v.SanitizeMarkdownContent(content, "how_to_use", MaxHowToUseLength)
}

// SanitizeReference sanitizes reference content
func (v *ContentValidator) SanitizeReference(content string) (string, error) {
	return v.SanitizeMarkdownContent(content, "reference", MaxReferenceLength)
}

// SanitizeExample sanitizes example/code content
func (v *ContentValidator) SanitizeExample(content string) (string, error) {
	return v.SanitizeMarkdownContent(content, "example", MaxExampleLength)
}

// ValidateImageURL validates image URL format
func (v *ContentValidator) ValidateImageURL(url string) (string, error) {
	url = strings.TrimSpace(url)

	// Empty is allowed
	if url == "" {
		return "", nil
	}

	if len(url) > MaxImageURLLength {
		return "", fmt.Errorf("image url: %w (max %d)", ErrFieldTooLong, MaxImageURLLength)
	}

	// Basic URL validation
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return "", fmt.Errorf("image url: %w (must start with http:// or https://)", ErrInvalidFormat)
	}

	return url, nil
}

// ValidateTags validates tag array
func (v *ContentValidator) ValidateTags(tags []string) ([]string, error) {
	if len(tags) > MaxTagCount {
		return nil, fmt.Errorf("tags: %w (max %d)", ErrTooManyTags, MaxTagCount)
	}

	sanitized := make([]string, 0, len(tags))
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		if tag == "" {
			continue
		}

		if utf8.RuneCountInString(tag) > MaxTagLength {
			return nil, fmt.Errorf("tag '%s': %w (max %d)", tag, ErrFieldTooLong, MaxTagLength)
		}

		// HTML escape tags
		tag = html.EscapeString(tag)
		sanitized = append(sanitized, tag)
	}

	return sanitized, nil
}

// removeDangerousTags removes potentially dangerous HTML tags
// This is a basic implementation - for production, consider using a proper HTML sanitizer
func (v *ContentValidator) removeDangerousTags(content string) string {
	// List of dangerous tags to remove
	dangerousTags := []string{
		"<script", "</script>",
		"<iframe", "</iframe>",
		"<object", "</object>",
		"<embed", "</embed>",
		"<applet", "</applet>",
		"<meta", "</meta>",
		"<link", "</link>",
		"<style", "</style>",
		"<form", "</form>",
		"<input", "</input>",
		"<button", "</button>",
		"<textarea", "</textarea>",
		"<select", "</select>",
	}

	// Remove dangerous tags (case-insensitive)
	for _, tag := range dangerousTags {
		re := regexp.MustCompile(`(?i)` + regexp.QuoteMeta(tag) + `[^>]*>`)
		content = re.ReplaceAllString(content, "")
	}

	// Remove javascript: and data: URLs
	content = regexp.MustCompile(`(?i)javascript:`).ReplaceAllString(content, "")
	content = regexp.MustCompile(`(?i)data:`).ReplaceAllString(content, "")

	// Remove on* event handlers
	content = regexp.MustCompile(`(?i)\s*on\w+\s*=`).ReplaceAllString(content, "")

	return content
}

// ValidateStatus validates status value
func (v *ContentValidator) ValidateStatus(status string) error {
	validStatuses := map[string]bool{
		"recommended":  true,
		"new":          true,
		"coming_soon":  true,
		"default":      true,
	}

	if !validStatuses[status] {
		return fmt.Errorf("status: invalid value '%s'", status)
	}

	return nil
}
