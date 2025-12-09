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
	"monorepo/backend-go/internal/server"
	"monorepo/backend-go/pkg/logger"
)

func main() {
	cfg := config.Load()

	logger.Init()
	defer logger.Log.Sync()

	if !cfg.EnableHTTP && !cfg.EnableGRPC {
		log.Fatal("At least one server (HTTP or gRPC) must be enabled")
	}

	var httpSrv *server.HTTPServer
	var grpcSrv *server.GRPCServer
	var wg sync.WaitGroup

	if cfg.EnableHTTP {
		httpSrv = server.NewHTTPServer(cfg)
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := httpSrv.Start(); err != nil {
				logger.Log.Error("HTTP Server error: " + err.Error())
			}
		}()
	} else {
		logger.Log.Info("⏭️  HTTP Server disabled")
	}

	if cfg.EnableGRPC {
		var err error
		grpcSrv, err = server.NewGRPCServer(cfg)
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
		logger.Log.Info("⏭️  gRPC Server disabled")
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("🛑 Shutdown signal received")

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
	logger.Log.Info("✨ All servers stopped gracefully")
}
