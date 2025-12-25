package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"monorepo/backend-go/internal/application/banner/command"
	"monorepo/backend-go/internal/application/banner/query"
	"monorepo/backend-go/internal/core/domain/banner/repository"
	"monorepo/backend-go/internal/infrastructure/adapter/http/request"
	"monorepo/backend-go/internal/infrastructure/adapter/http/response"

	"github.com/gin-gonic/gin"
)

// BannerHandler handles HTTP requests for banner operations
type BannerHandler struct {
	createBannerHandler  *command.CreateBannerHandler
	updateBannerHandler  *command.UpdateBannerHandler
	deleteBannerHandler  *command.DeleteBannerHandler
	reorderBannersHandler *command.ReorderBannersHandler
	listBannersHandler   *query.ListBannersHandler
	getBannerHandler     *query.GetBannerHandler
}

// NewBannerHandler creates a new BannerHandler
func NewBannerHandler(
	createBannerHandler *command.CreateBannerHandler,
	updateBannerHandler *command.UpdateBannerHandler,
	deleteBannerHandler *command.DeleteBannerHandler,
	reorderBannersHandler *command.ReorderBannersHandler,
	listBannersHandler *query.ListBannersHandler,
	getBannerHandler *query.GetBannerHandler,
) *BannerHandler {
	return &BannerHandler{
		createBannerHandler:  createBannerHandler,
		updateBannerHandler:  updateBannerHandler,
		deleteBannerHandler:  deleteBannerHandler,
		reorderBannersHandler: reorderBannersHandler,
		listBannersHandler:   listBannersHandler,
		getBannerHandler:     getBannerHandler,
	}
}

// ListBanners handles GET /api/banners
func (h *BannerHandler) ListBanners(c *gin.Context) {
	ctx := c.Request.Context()

	// Parse query parameters for filtering
	filters := repository.ListFilters{}

	// Status filter
	if statusStr := c.Query("status"); statusStr != "" {
		status, err := strconv.ParseBool(statusStr)
		if err == nil {
			filters.Status = &status
		}
	}

	// Segment tier filter
	if tier := c.Query("segment_tier"); tier != "" {
		filters.SegmentTier = &tier
	}

	// Start date filter
	if startDateStr := c.Query("start_date"); startDateStr != "" {
		startDate, err := time.Parse(time.RFC3339, startDateStr)
		if err == nil {
			filters.StartDate = &startDate
		}
	}

	// End date filter
	if endDateStr := c.Query("end_date"); endDateStr != "" {
		endDate, err := time.Parse(time.RFC3339, endDateStr)
		if err == nil {
			filters.EndDate = &endDate
		}
	}

	// Execute query
	banners, err := h.listBannersHandler.Handle(ctx, filters)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response
	c.JSON(http.StatusOK, banners)
}

// GetBanner handles GET /api/banners/:id
func (h *BannerHandler) GetBanner(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	// Execute query
	banner, err := h.getBannerHandler.Handle(ctx, id)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response
	c.JSON(http.StatusOK, banner)
}

// CreateBanner handles POST /api/banners
func (h *BannerHandler) CreateBanner(c *gin.Context) {
	ctx := c.Request.Context()

	// Bind request
	var req request.CreateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	// Generate unique ID using timestamp and random string
	id := fmt.Sprintf("banner-%d", time.Now().UnixNano())

	// Convert to command
	cmd := command.CreateBannerCommand{
		ID:           id,
		ImageTH:      req.ImageTH,
		ImageEN:      req.ImageEN,
		URLTH:        req.URLTH,
		URLEN:        req.URLEN,
		SegmentTiers: req.SegmentTiers,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		IsActive:     req.IsActive,
		Priority:     req.Priority,
	}

	// Execute command
	banner, err := h.createBannerHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response
	c.JSON(http.StatusCreated, banner)
}

// UpdateBanner handles PUT /api/banners/:id
func (h *BannerHandler) UpdateBanner(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	// Bind request
	var req request.UpdateBannerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	// Convert to command
	cmd := command.UpdateBannerCommand{
		ID:           id,
		ImageTH:      req.ImageTH,
		ImageEN:      req.ImageEN,
		URLTH:        req.URLTH,
		URLEN:        req.URLEN,
		SegmentTiers: req.SegmentTiers,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		IsActive:     req.IsActive,
		Priority:     req.Priority,
	}

	// Execute command
	banner, err := h.updateBannerHandler.Handle(ctx, cmd)
	if err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response
	c.JSON(http.StatusOK, banner)
}

// DeleteBanner handles DELETE /api/banners/:id
func (h *BannerHandler) DeleteBanner(c *gin.Context) {
	ctx := c.Request.Context()
	id := c.Param("id")

	// Convert to command
	cmd := command.DeleteBannerCommand{
		ID: id,
	}

	// Execute command
	if err := h.deleteBannerHandler.Handle(ctx, cmd); err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response (204 No Content)
	c.Status(http.StatusNoContent)
}

// ReorderBanners handles POST /api/banners/reorder
func (h *BannerHandler) ReorderBanners(c *gin.Context) {
	ctx := c.Request.Context()

	// Bind request
	var cmd command.ReorderBannersCommand
	if err := c.ShouldBindJSON(&cmd); err != nil {
		c.JSON(http.StatusBadRequest, response.NewErrorResponse("VALIDATION_ERROR", "Invalid request body"))
		return
	}

	// Execute command
	if err := h.reorderBannersHandler.Handle(ctx, cmd); err != nil {
		status := response.HTTPStatusFromError(err)
		c.JSON(status, response.ErrorResponseFromError(err))
		return
	}

	// Return successful response
	c.JSON(http.StatusOK, response.NewSuccessResponse("Banners reordered successfully"))
}
