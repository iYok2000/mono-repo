package rest

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"monorepo/backend-go/internal/config"
	pb "monorepo/backend-go/proto/greeter"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type SayHelloRequest struct {
	Name string `json:"name" binding:"required"`
}

type SayHelloResponse struct {
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

func getGRPCClient(cfg *config.Config) (pb.GreeterServiceClient, *grpc.ClientConn, error) {
	conn, err := grpc.NewClient(
		"localhost:"+cfg.GRPCPort,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		return nil, nil, err
	}
	return pb.NewGreeterServiceClient(conn), conn, nil
}

func SayHelloREST(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req SayHelloRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request: " + err.Error(),
			})
			return
		}

		client, conn, err := getGRPCClient(cfg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to connect to gRPC server: " + err.Error(),
			})
			return
		}
		defer conn.Close()

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		resp, err := client.SayHello(ctx, &pb.HelloRequest{Name: req.Name})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "gRPC call failed: " + err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": SayHelloResponse{
				Message:   resp.Message,
				Timestamp: resp.Timestamp,
			},
		})
	}
}

func SayHelloStreamREST(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req SayHelloRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error":   "Invalid request: " + err.Error(),
			})
			return
		}

		client, conn, err := getGRPCClient(cfg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Failed to connect to gRPC server: " + err.Error(),
			})
			return
		}
		defer conn.Close()

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		stream, err := client.SayHelloStream(ctx, &pb.HelloRequest{Name: req.Name})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "gRPC stream failed: " + err.Error(),
			})
			return
		}

		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")

		flusher, ok := c.Writer.(http.Flusher)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Streaming not supported",
			})
			return
		}

		for {
			resp, err := stream.Recv()
			if err != nil {
				break
			}

			data := fmt.Sprintf("data: {\"message\":\"%s\",\"timestamp\":%d}\n\n", resp.Message, resp.Timestamp)
			c.Writer.Write([]byte(data))
			flusher.Flush()
		}
	}
}
