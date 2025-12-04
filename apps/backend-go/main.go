package main

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type HealthCheck struct {
	Status    string `json:"status"`
	Service   string `json:"service"`
	Timestamp string `json:"timestamp"`
}

type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

func main() {

	gin.SetMode(gin.DebugMode)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/", func(c *gin.Context) {
		response := ApiResponse{
			Success: true,
			Message: "Gin API is running!",
			Data:    "Welcome to the Golang backend API",
		}
		c.JSON(http.StatusOK, response)
	})

	router.GET("/health", func(c *gin.Context) {
		health := HealthCheck{
			Status:    "healthy",
			Service:   "backend-go",
			Timestamp: time.Now().Format(time.RFC3339),
		}

		response := ApiResponse{
			Success: true,
			Data:    health,
		}

		c.JSON(http.StatusOK, response)
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	router.Run(":" + port)
}
