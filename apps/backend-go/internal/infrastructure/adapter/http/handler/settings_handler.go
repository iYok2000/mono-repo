package handler

import (
	"database/sql"
	"encoding/json"
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
// Public endpoint — no auth required (landing page fetches this)
func (h *SettingsHandler) GetHomeSections(c *gin.Context) {
	var rawValue []byte

	err := h.db.QueryRowContext(
		c.Request.Context(),
		`SELECT value FROM home_settings WHERE key = 'section_visibility' LIMIT 1`,
	).Scan(&rawValue)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusOK, gin.H{"sections": defaultSectionVisibility})
		return
	}
	if err != nil {
		// Return defaults on DB error to not break landing page
		c.JSON(http.StatusOK, gin.H{"sections": defaultSectionVisibility})
		return
	}

	var sections SectionVisibility
	if err := json.Unmarshal(rawValue, &sections); err != nil {
		c.JSON(http.StatusOK, gin.H{"sections": defaultSectionVisibility})
		return
	}

	// Merge with defaults to ensure all keys exist
	for k, v := range defaultSectionVisibility {
		if _, exists := sections[k]; !exists {
			sections[k] = v
		}
	}

	c.JSON(http.StatusOK, gin.H{"sections": sections})
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

	value, err := json.Marshal(req.Sections)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to serialize settings"})
		return
	}

	_, err = h.db.ExecContext(
		c.Request.Context(),
		`INSERT INTO home_settings (key, value)
		 VALUES ('section_visibility', $1)
		 ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
		value,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save settings: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sections": req.Sections, "message": "settings saved"})
}
