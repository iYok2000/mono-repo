package config

import (
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
}

func Load() *Config {
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
	}
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
