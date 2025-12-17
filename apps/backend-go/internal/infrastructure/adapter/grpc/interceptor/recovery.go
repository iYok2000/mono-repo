package interceptor

import (
	"context"
	"runtime/debug"

	"monorepo/backend-go/pkg/logger"

	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Recovery is a gRPC unary interceptor that recovers from panics
func Recovery() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (resp interface{}, err error) {
		defer func() {
			if r := recover(); r != nil {
				logger.Log.Error("gRPC panic recovered",
					zap.String("method", info.FullMethod),
					zap.Any("panic", r),
					zap.String("stack", string(debug.Stack())),
				)

				err = status.Errorf(codes.Internal, "Internal server error: %v", r)
			}
		}()

		resp, err = handler(ctx, req)
		return resp, err
	}
}

// StreamRecovery is a gRPC stream interceptor that recovers from panics
func StreamRecovery() grpc.StreamServerInterceptor {
	return func(
		srv interface{},
		ss grpc.ServerStream,
		info *grpc.StreamServerInfo,
		handler grpc.StreamHandler,
	) (err error) {
		defer func() {
			if r := recover(); r != nil {
				logger.Log.Error("gRPC stream panic recovered",
					zap.String("method", info.FullMethod),
					zap.Any("panic", r),
					zap.String("stack", string(debug.Stack())),
				)

				err = status.Errorf(codes.Internal, "Internal server error: %v", r)
			}
		}()

		err = handler(srv, ss)
		return err
	}
}
