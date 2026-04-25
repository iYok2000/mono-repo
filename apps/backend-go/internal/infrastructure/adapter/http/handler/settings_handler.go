package handler

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SectionVisibility maps section key → visible bool
type SectionVisibility map[string]bool

var defaultSectionVisibility = SectionVisibility{
	"hero":         true,
	"what_is_it":   true,
	"sku":          true,
	"how_it_works": true,
	"occasions":    true,
	"why_nfc":      true,
	"why_us":       true,
	"preview":      true,
	"faq":          true,
	"final_cta":    true,
}

// SettingsHandler handles home settings API
type SettingsHandler struct {
	db *sql.DB
}

// NewSettingsHandler creates a new SettingsHandler
func NewSettingsHandler(db *sql.DB) *SettingsHandler {
	return &SettingsHandler{db: db}
}

// GetHomeSections GET /api/settings/home-sections
// Public endpoint — reads *_enabled columns from the GORM-managed home_settings table
func (h *SettingsHandler) GetHomeSections(c *gin.Context) {
	var (
		heroEnabled       bool
		whatIsItEnabled   bool
		skuEnabled        bool
		howItWorksEnabled bool
		occasionsEnabled  bool
		whyNFCEnabled     bool
		whyUsEnabled      bool
		previewEnabled    bool
		faqEnabled        bool
		finalCTAEnabled   bool
	)

	err := h.db.QueryRowContext(
		c.Request.Context(),
		`SELECT
			hero_enabled,
			what_is_it_enabled,
			sku_enabled,
			how_it_works_enabled,
			occasions_enabled,
			why_nfc_enabled,
			why_us_enabled,
			preview_enabled,
			faq_enabled,
			final_cta_enabled
		FROM home_settings WHERE id = 'default' LIMIT 1`,
	).Scan(
		&heroEnabled,
		&whatIsItEnabled,
		&skuEnabled,
		&howItWorksEnabled,
		&occasionsEnabled,
		&whyNFCEnabled,
		&whyUsEnabled,
		&previewEnabled,
		&faqEnabled,
		&finalCTAEnabled,
	)

	if err != nil {
		// Return defaults on any error (table not seeded yet, etc.)
		c.JSON(http.StatusOK, gin.H{"sections": defaultSectionVisibility})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sections": SectionVisibility{
		"hero":         heroEnabled,
		"what_is_it":   whatIsItEnabled,
		"sku":          skuEnabled,
		"how_it_works": howItWorksEnabled,
		"occasions":    occasionsEnabled,
		"why_nfc":      whyNFCEnabled,
		"why_us":       whyUsEnabled,
		"preview":      previewEnabled,
		"faq":          faqEnabled,
		"final_cta":    finalCTAEnabled,
	}})
}

// UpdateHomeSections PUT /api/settings/home-sections (auth required)
func (h *SettingsHandler) UpdateHomeSections(c *gin.Context) {
	var req struct {
		Sections SectionVisibility `json:"sections" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	// Validate keys — only allow known section keys
	allowedKeys := map[string]bool{
		"hero": true, "what_is_it": true, "sku": true,
		"how_it_works": true, "occasions": true, "why_nfc": true,
		"why_us": true, "preview": true, "faq": true, "final_cta": true,
	}
	for k := range req.Sections {
		if !allowedKeys[k] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unknown section key: " + k})
			return
		}
	}

	// Merge with defaults so all keys are present
	merged := make(SectionVisibility)
	for k, v := range defaultSectionVisibility {
		merged[k] = v
	}
	for k, v := range req.Sections {
		merged[k] = v
	}

	_, err := h.db.ExecContext(
		c.Request.Context(),
		`UPDATE home_settings SET
			hero_enabled         = $1,
			what_is_it_enabled   = $2,
			sku_enabled          = $3,
			how_it_works_enabled = $4,
			occasions_enabled    = $5,
			why_nfc_enabled      = $6,
			why_us_enabled       = $7,
			preview_enabled      = $8,
			faq_enabled          = $9,
			final_cta_enabled    = $10
		WHERE id = 'default'`,
		merged["hero"],
		merged["what_is_it"],
		merged["sku"],
		merged["how_it_works"],
		merged["occasions"],
		merged["why_nfc"],
		merged["why_us"],
		merged["preview"],
		merged["faq"],
		merged["final_cta"],
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sections": merged})
}
