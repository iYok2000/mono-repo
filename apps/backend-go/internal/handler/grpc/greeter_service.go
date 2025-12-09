package grpc

import (
	"context"
	"fmt"
	"time"

	pb "monorepo/backend-go/proto/greeter"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type greeterService struct {
	pb.UnimplementedGreeterServiceServer
}

func NewGreeterService() pb.GreeterServiceServer {
	return &greeterService{}
}

func (s *greeterService) SayHello(
	ctx context.Context,
	req *pb.HelloRequest,
) (*pb.HelloResponse, error) {

	if req.GetName() == "" {
		return nil, status.Error(codes.InvalidArgument, "name is required")
	}

	response := &pb.HelloResponse{
		Message:   fmt.Sprintf("Hello, %s!", req.GetName()),
		Timestamp: time.Now().Unix(),
	}

	return response, nil
}

func (s *greeterService) SayHelloStream(
	req *pb.HelloRequest,
	stream pb.GreeterService_SayHelloStreamServer,
) error {

	if req.GetName() == "" {
		return status.Error(codes.InvalidArgument, "name is required")
	}

	greetings := []string{
		fmt.Sprintf("Hello, %s!", req.GetName()),
		fmt.Sprintf("Welcome, %s!", req.GetName()),
		fmt.Sprintf("Nice to meet you, %s!", req.GetName()),
		fmt.Sprintf("Goodbye, %s!", req.GetName()),
	}

	for _, greeting := range greetings {

		if err := stream.Context().Err(); err != nil {
			return status.Error(codes.Canceled, "stream cancelled by client")
		}

		response := &pb.HelloResponse{
			Message:   greeting,
			Timestamp: time.Now().Unix(),
		}

		if err := stream.Send(response); err != nil {
			return status.Errorf(codes.Internal, "failed to send response: %v", err)
		}

		time.Sleep(500 * time.Millisecond)
	}

	return nil
}
