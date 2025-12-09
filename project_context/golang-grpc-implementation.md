# Golang gRPC Implementation

## Overview

Implemented dual-server architecture for Go backend: Gin (HTTP REST) + gRPC running simultaneously with shared interceptors/middleware.

## Why

- **Learning gRPC**: Step-by-step implementation with detailed explanations
- **Flexibility**: Config-driven server selection via environment variables
- **Code Reuse**: Shared logger between HTTP and gRPC through wrapper pattern

## How

### Architecture

```
internal/
├── handler/
│   ├── rest/          # Gin HTTP handlers
│   └── grpc/          # gRPC service handlers
│       └── greeter_service.go
├── interceptor/       # gRPC middleware
│   ├── logger.go      # Request logging
│   └── recovery.go    # Panic recovery
├── server/
│   ├── http.go        # Gin HTTP server
│   └── grpc.go        # gRPC server with graceful shutdown
proto/
└── greeter/
    ├── greeter.proto           # Protocol buffer definition
    ├── greeter.pb.go           # Generated structs
    └── greeter_grpc.pb.go      # Generated gRPC interfaces
```

### gRPC Service

**Service Definition** (`proto/greeter/greeter.proto`):
- `SayHello`: Unary RPC (single request → single response)
- `SayHelloStream`: Server streaming RPC (single request → multiple responses)

**Code Generation**:
```bash
protoc --go_out=. --go_opt=paths=source_relative \
  --go-grpc_out=. --go-grpc_opt=paths=source_relative \
  proto/greeter/greeter.proto
```

### Interceptors (Middleware)

1. **Logger**: Logs method, duration, status for both unary and streaming RPCs
2. **Recovery**: Catches panics using defer+recover pattern, returns gRPC Internal error instead of crashing

### Server Setup

**gRPC Server** (`internal/server/grpc.go`):
- TCP listener on configured port
- Chained interceptors (Logger → Recovery)
- Service registration with reflection enabled
- Graceful shutdown with 5-second timeout

**Config** (`.env`):
```env
ENABLE_HTTP=true
ENABLE_GRPC=true
HTTP_PORT=8080
GRPC_PORT=50051
```

## Key Concepts Explained

1. **Protocol Buffers Auto-Generation**:
   - `.proto` defines: `string name = 1;`
   - protoc generates: `Name string` field + `GetName()` getter method
   - Getter pattern provides nil-safety

2. **Interceptor Chain**:
   - Similar to middleware in HTTP
   - Executes in order: Logger → Recovery → Handler

3. **Graceful Shutdown**:
   - Both HTTP and gRPC servers support graceful shutdown
   - Wait for existing connections to complete
   - 5-second timeout before force stop

## Status

✅ Proto definition created
✅ Code generated from proto
✅ Interceptors implemented (Logger, Recovery)
✅ gRPC service handler implemented
✅ gRPC server implemented
⏭️ **Next**: Update main.go to run both servers concurrently

## Notes

- **Folder naming**: Fixed typo `gprc` → `grpc`
- **Interceptor naming**: Fixed function names to match actual implementation (Logger, Recovery, StreamLogger)
- **Comments**: Removed for cleaner code per user preference
