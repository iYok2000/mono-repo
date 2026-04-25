package handler

import (
	"net/http"

	"monorepo/backend-go/internal/application/homesettings/command"
	"monorepo/backend-go/internal/application/homesettings/dto"
	"monorepo/backend-go/internal/application/homesettings/query"
	"monorepo/backend-go/internal/core/domain/auth"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"

	"github.com/gin-gonic/gin"
)

// HomeSettingsHandler handles HTTP requests for home settings operations
type HomeSettingsHandler struct {
	getHomeSettingsHandler    *query.GetHomeSettingsHandler
	updateHomeSettingsHandler *command.UpdateHomeSettingsHandler
}

// NewHomeSettingsHandler creates a new HomeSettingsHandler
func NewHomeSettingsHandler(
	getHomeSettingsHandler *query.GetHomeSettingsHandler,
	updateHomeSettingsHandler *command.UpdateHomeSettingsHandler,
) *HomeSettingsHandler {
	return &HomeSettingsHandler{
		getHomeSettingsHandler:    getHomeSettingsHandler,
		updateHomeSettingsHandler: updateHomeSettingsHandler,
	}
}

// GetHomeSettings handles GET /api/home-settings
func (h *HomeSettingsHandler) GetHomeSettings(c *gin.Context) {
	ctx := c.Request.Context()

	settings, err := h.getHomeSettingsHandler.Handle(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.NewErrorResponse("INTERNAL_ERROR", "failed to get home settings"))
		return
	}

	c.JSON(http.StatusOK, response.NewSuccessResponse(settings))
}

// UpdateHomeSettings handles PUT /api/home-settings
func (h *HomeSettingsHandler) UpdateHomeSettings(c *gin.Context) {
	ctx := c.Request.Context()

	var updateDTO dto.UpdateHomeSettingsDTO
	if err := c.ShouldBindJSON(&updateDTO); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", err.Error()))
		return
	}

	// Get user claims from context (set by auth middleware)
	userValue, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, response.NewErrorResponse("UNAUTHORIZED", "admin authentication required"))
		return
	}

	claims, ok := userValue.(*auth.JWTClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, response.NewErrorResponse("INTERNAL_ERROR", "invalid user claims format"))
		return
	}

	// Use username as updatedBy
	updatedBy := claims.Username

	settings, err := h.updateHomeSettingsHandler.Handle(ctx, &updateDTO, updatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.NewErrorResponse("INTERNAL_ERROR", "failed to update home settings"))
		return
	}

	c.JSON(http.StatusOK, response.NewSuccessResponse(settings))
}
