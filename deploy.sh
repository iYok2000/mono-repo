#!/bin/bash

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Build Next.js app
echo -e "${BLUE}🏗️  Building Next.js app...${NC}"
cd apps/web
pnpm build
cd ../..

# Build Go backend
echo -e "${BLUE}🏗️  Building Go backend...${NC}"
cd apps/backend-go
go build -o bin/server cmd/server/main.go
cd ../..

# Restart services using PM2
echo -e "${BLUE}🔄 Restarting services...${NC}"

# Stop existing processes (ignore errors if not running)
pm2 delete backend-go 2>/dev/null || true
pm2 delete web 2>/dev/null || true

# Start backend
echo -e "${BLUE}🚀 Starting Go backend...${NC}"
cd apps/backend-go
pm2 start bin/server --name backend-go
cd ../..

# Start Next.js
echo -e "${BLUE}🚀 Starting Next.js app...${NC}"
cd apps/web
pm2 start npm --name web -- start
cd ../..

# Save PM2 configuration
pm2 save

# Show status
pm2 list

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
