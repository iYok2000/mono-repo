#!/bin/bash

# Don't exit on error - we want to see all errors
set +e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Get absolute path of project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${BLUE}📂 Project root: ${PROJECT_ROOT}${NC}"

# Create logs directory
mkdir -p "${PROJECT_ROOT}/logs"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Build Next.js app
echo -e "${BLUE}🏗️  Building Next.js app...${NC}"
cd "${PROJECT_ROOT}/apps/web"
pnpm build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build Next.js app${NC}"
    exit 1
fi
cd "${PROJECT_ROOT}"

# Build Go backend
echo -e "${BLUE}🏗️  Building Go backend...${NC}"
cd "${PROJECT_ROOT}/apps/backend-go"
mkdir -p bin
go build -o bin/server cmd/server/main.go
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build Go backend${NC}"
    exit 1
fi
cd "${PROJECT_ROOT}"

# Verify binary exists
if [ ! -f "${PROJECT_ROOT}/apps/backend-go/bin/server" ]; then
    echo -e "${RED}❌ Backend binary not found!${NC}"
    exit 1
fi

# Restart services using PM2
echo -e "${BLUE}🔄 Restarting services...${NC}"

# Stop existing processes (ignore errors if not running)
pm2 delete backend-go 2>/dev/null || true
pm2 delete web 2>/dev/null || true

# Start backend from project root (so it can load .env)
echo -e "${BLUE}🚀 Starting Go backend...${NC}"
cd "${PROJECT_ROOT}"
pm2 start apps/backend-go/bin/server \
    --name backend-go \
    --cwd "${PROJECT_ROOT}" \
    --log "${PROJECT_ROOT}/logs/backend-go.log" \
    --error "${PROJECT_ROOT}/logs/backend-go-error.log"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start Go backend${NC}"
    echo -e "${YELLOW}📋 Checking PM2 logs...${NC}"
    pm2 logs backend-go --lines 50 --nostream
    exit 1
fi

# Start Next.js
echo -e "${BLUE}🚀 Starting Next.js app...${NC}"
cd "${PROJECT_ROOT}/apps/web"
pm2 start npm \
    --name web \
    --cwd "${PROJECT_ROOT}/apps/web" \
    --log "${PROJECT_ROOT}/logs/web.log" \
    --error "${PROJECT_ROOT}/logs/web-error.log" \
    -- start

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start Next.js app${NC}"
    echo -e "${YELLOW}📋 Checking PM2 logs...${NC}"
    pm2 logs web --lines 50 --nostream
    exit 1
fi

cd "${PROJECT_ROOT}"

# Save PM2 configuration
pm2 save

# Show status
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 list

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
