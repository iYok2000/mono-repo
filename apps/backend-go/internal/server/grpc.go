package server

import (
	"context"
	"fmt"
	"net"

	"monorepo/backend-go/internal/config"
	greeterHandler "monorepo/backend-go/internal/handler/grpc"
	"monorepo/backend-go/internal/interceptor"
	"monorepo/backend-go/pkg/logger"
	pb "monorepo/backend-go/proto/greeter"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	server *grpc.Server
	lis    net.Listener
	port   string
}

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

	pb.RegisterGreeterServiceServer(grpcServer, greeterHandler.NewGreeterService())
	reflection.Register(grpcServer)

	return &GRPCServer{
		server: grpcServer,
		lis:    lis,
		port:   cfg.GRPCPort,
	}, nil
}

func (s *GRPCServer) Start() error {
	logger.Log.Info(fmt.Sprintf("🚀 gRPC Server listening on port %s", s.port))
	if err := s.server.Serve(s.lis); err != nil {
		return fmt.Errorf("gRPC server error: %w", err)
	}
	return nil
}

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
