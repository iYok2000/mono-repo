package interceptor

import (
	"context"
	"time"

	"monorepo/backend-go/pkg/logger"

	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
)

// Logger is a gRPC unary interceptor that logs requests
func Logger() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {
		start := time.Now()

		resp, err := handler(ctx, req)

		duration := time.Since(start)
		code := status.Code(err)

		logger.Log.Info("gRPC request",
			zap.String("method", info.FullMethod),
			zap.Duration("duration", duration),
			zap.String("status", code.String()),
		)

		return resp, err
	}
}

// StreamLogger is a gRPC stream interceptor that logs stream requests
func StreamLogger() grpc.StreamServerInterceptor {
	return func(
		srv interface{},
		ss grpc.ServerStream,
		info *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) error {
		start := time.Now()

		err := handler(srv, ss)

		duration := time.Since(start)
		code := status.Code(err)

		logger.Log.Info("gRPC stream",
			zap.String("method", info.FullMethod),
			zap.Duration("duration", duration),
			zap.String("status", code.String()),
		)

		return err
	}
}
