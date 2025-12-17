package handler

import (
	"context"

	pb "monorepo/backend-go/proto/greeter"
)

// GreeterService implements the greeter service
type GreeterService struct {
	pb.UnimplementedGreeterServiceServer
}

// NewGreeterService creates a new greeter service
func NewGreeterService() *GreeterService {
	return &GreeterService{}
}

// SayHello implements the SayHello RPC method
func (s *GreeterService) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
	return &pb.HelloResponse{
		Message: "Hello, " + req.Name + "!",
	}, nil
}
