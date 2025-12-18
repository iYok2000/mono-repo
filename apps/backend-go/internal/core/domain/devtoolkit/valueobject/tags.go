package valueobject

// PredefinedTags contains all available tags for DevToolkits
var PredefinedTags = []string{
	"API",
	"Authentication",
	"Database",
	"DevOps",
	"Frontend",
	"Backend",
	"Testing",
	"Monitoring",
	"Security",
	"Cloud",
	"AI/ML",
	"Mobile",
	"Analytics",
	"Performance",
	"Documentation",
}

// IsValidTag checks if a tag is in the predefined list
func IsValidTag(tag string) bool {
	for _, t := range PredefinedTags {
		if t == tag {
			return true
		}
	}
	return false
}

// ValidateTags validates a list of tags
func ValidateTags(tags []string) bool {
	for _, tag := range tags {
		if !IsValidTag(tag) {
			return false
		}
	}
	return true
}
