package server

import (
	"context"
	"fmt"
	"net"

	"monorepo/backend-go/internal/config"
	"monorepo/backend-go/internal/infrastructure/adapter/grpc/handler"
	"monorepo/backend-go/internal/infrastructure/adapter/grpc/interceptor"
	"monorepo/backend-go/pkg/logger"
	pb "monorepo/backend-go/proto/greeter"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// GRPCServer represents a gRPC server
type GRPCServer struct {
	server *grpc.Server
	lis    net.Listener
	port   string
}

// NewGRPCServer creates a new gRPC server
func NewGRPCServer(cfg *config.Config) (*GRPCServer, error) {
	lis, err := net.Listen("tcp", ":"+cfg.GRPCPort)
	if err != nil {
		return nil, fmt.Errorf("failed to listen: %w", err)
	}

	grpcServer := grpc.NewServer(
		grpc.ChainUnaryInterceptor(
			interceptor.Logger(),
			interceptor.Recovery(),
		),
		grpc.ChainStreamInterceptor(
			interceptor.StreamLogger(),
		),
	)

	// Register services
	pb.RegisterGreeterServiceServer(grpcServer, handler.NewGreeterService())
	reflection.Register(grpcServer)

	return &GRPCServer{
		server: grpcServer,
		lis:    lis,
		port:   cfg.GRPCPort,
	}, nil
}

// Start starts the gRPC server
func (s *GRPCServer) Start() error {
	logger.Log.Info(fmt.Sprintf("🚀 gRPC Server listening on port %s", s.port))
	if err := s.server.Serve(s.lis); err != nil {
		return fmt.Errorf("gRPC server error: %w", err)
	}
	return nil
}

// Shutdown gracefully shuts down the gRPC server
func (s *GRPCServer) Shutdown(ctx context.Context) error {
	logger.Log.Info("⏳ Shutting down gRPC server...")

	stopped := make(chan struct{})
	go func() {
		s.server.GracefulStop()
		close(stopped)
	}()

	select {
	case <-ctx.Done():
		logger.Log.Warn("⚠️  gRPC shutdown timeout, forcing stop")
		s.server.Stop()
		return ctx.Err()
	case <-stopped:
		logger.Log.Info("✅ gRPC server stopped")
		return nil
	}
}
