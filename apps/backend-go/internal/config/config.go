package config

import (
	"os"
	"strconv"
)

type Config struct {
	EnableHTTP  bool
	EnableGRPC  bool
	HTTPPort    string
	GRPCPort    string
	ServiceName string
	Environment string
	FrontendURL string
}

func Load() *Config {
	return &Config{
		EnableHTTP:  getEnvBool("ENABLE_HTTP", true),
		EnableGRPC:  getEnvBool("ENABLE_GRPC", true),
		HTTPPort:    getEnv("HTTP_PORT", "8080"),
		GRPCPort:    getEnv("GRPC_PORT", "50051"),
		ServiceName: getEnv("SERVICE_NAME", "backend-go"),
		Environment: getEnv("ENVIRONMENT", "development"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
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
