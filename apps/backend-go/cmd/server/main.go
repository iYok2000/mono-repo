package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/container"
	grpcserver "monorepo/backend-go/internal/infrastructure/adapter/grpc/server"
	httpserver "monorepo/backend-go/internal/infrastructure/adapter/http/server"
	"monorepo/backend-go/pkg/logger"

	"github.com/joho/godotenv"
)

func main() {
	// Try to load .env from multiple locations
	// 1. Root .env (for pnpm dev from root)
	// 2. Local .env (for go run from apps/backend-go/)
	// 3. Environment variables (for Docker)
	_ = godotenv.Load("../../.env")
	_ = godotenv.Load(".env")

	cfg := config.Load()

	logger.Init()
	defer logger.Log.Sync()

	cnt, err := container.New(cfg)
	if err != nil {
		logger.Log.Fatal("failed to create container: " + err.Error())
	}
	defer func() {
		if err := cnt.Close(); err != nil {
			logger.Log.Error("failed to close container: " + err.Error())
		}
	}()

	if !cfg.EnableHTTP && !cfg.EnableGRPC {
		log.Fatal("At least one server (HTTP or gRPC) must be enabled")
	}

	var httpSrv *httpserver.HTTPServer
	var grpcSrv *grpcserver.GRPCServer
	var wg sync.WaitGroup

	if cfg.EnableHTTP {
		httpSrv, err := httpserver.NewHTTPServer(cfg, cnt)
		if err != nil {
			logger.Log.Fatal("failed to create HTTP server: " + err.Error())
		}
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := httpSrv.Start(); err != nil {
				logger.Log.Error("HTTP Server error: " + err.Error())
			}
		}()
	} else {
		logger.Log.Info("⏭ HTTP Server disabled")
	}

	if cfg.EnableGRPC {
		var err error
		grpcSrv, err = grpcserver.NewGRPCServer(cfg)
		if err != nil {
			logger.Log.Fatal("Failed to create gRPC server: " + err.Error())
		}
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := grpcSrv.Start(); err != nil {
				logger.Log.Error("gRPC Server error: " + err.Error())
			}
		}()
	} else {
		logger.Log.Info("⏭ gRPC Server disabled")
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("Shutdown signal received")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var shutdownWg sync.WaitGroup

	if httpSrv != nil {
		shutdownWg.Add(1)
		go func() {
			defer shutdownWg.Done()
			if err := httpSrv.Shutdown(ctx); err != nil {
				logger.Log.Error("HTTP shutdown error: " + err.Error())
			}
		}()
	}

	if grpcSrv != nil {
		shutdownWg.Add(1)
		go func() {
			defer shutdownWg.Done()
			if err := grpcSrv.Shutdown(ctx); err != nil {
				logger.Log.Error("gRPC shutdown error: " + err.Error())
			}
		}()
	}

	shutdownWg.Wait()
	logger.Log.Info("All servers stopped gracefully")
}
