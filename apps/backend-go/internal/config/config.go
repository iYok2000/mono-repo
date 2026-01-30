package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	EnableHTTP         bool
	EnableGRPC         bool
	HTTPPort           string
	GRPCPort           string
	ServiceName        string
	Environment        string
	FrontendURL        string
	DatabaseURL        string
	CorsAllowedOrigins []string
	JWTSecret          string // Added for JWT authentication
}

func Load() *Config {
	jwtSecret := os.Getenv("JWT_SECRET")

	// Enforce JWT_SECRET requirement
	if jwtSecret == "" {
		log.Fatal("FATAL: JWT_SECRET environment variable must be set and cannot be empty")
	}

	// Warn if JWT_SECRET is too short
	if len(jwtSecret) < 32 {
		log.Println("WARNING: JWT_SECRET should be at least 32 characters for security")
	}

	return &Config{
		EnableHTTP:         getEnvBool("ENABLE_HTTP", true),
		EnableGRPC:         getEnvBool("ENABLE_GRPC", false),
		HTTPPort:           getEnv("HTTP_PORT", "8080"),
		GRPCPort:           getEnv("GRPC_PORT", "50051"),
		ServiceName:        getEnv("SERVICE_NAME", "backend-go"),
		Environment:        getEnv("ENVIRONMENT", "development"),
		FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:3000"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		CorsAllowedOrigins: getEnvArray("CORS_ALLOWED_ORIGINS", "http://localhost:3000"),
		JWTSecret:          jwtSecret,
	}
}

func Validate(cfg *Config) error {
	if cfg.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}
	if len(cfg.JWTSecret) < 32 {
		return fmt.Errorf("JWT_SECRET must be at least 32 characters long")
	}
	return nil
}

func getEnv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if value := os.Getenv(key); value != "" {
		result, err := strconv.ParseBool(value)
		if err == nil {
			return result
		}
	}
	return fallback
}

func getEnvArray(key string, fallback string) []string {
	value := os.Getenv(key)
	if value == "" {
		value = fallback
	}

	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
