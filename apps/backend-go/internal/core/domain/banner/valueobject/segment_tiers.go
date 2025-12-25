package valueobject

// PredefinedSegmentTiers contains all valid segment tier values
// This is config-based for flexibility - can be easily modified without database changes
var PredefinedSegmentTiers = []string{
	"silver",
	"gold",
	"diamond",
	"platinum",
}

// ValidateSegmentTiers checks if all provided tiers are in the predefined list
func ValidateSegmentTiers(tiers []string) bool {
	// Create a map for O(1) lookup
	tierMap := make(map[string]bool)
	for _, tier := range PredefinedSegmentTiers {
		tierMap[tier] = true
	}

	// Check if all provided tiers are valid
	for _, tier := range tiers {
		if !tierMap[tier] {
			return false
		}
	}

	return true
}
