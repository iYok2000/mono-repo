#!/bin/bash

set -e

echo "🚀 Starting deployment..."

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${BLUE}📂 Project: ${ROOT}${NC}"

mkdir -p "${ROOT}/logs"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Build shared-types
echo -e "${BLUE}🔧 Building shared-types...${NC}"
pnpm --filter @mono-repo/shared-types build

# Build Next.js
echo -e "${BLUE}🏗️ Building Next.js...${NC}"
cd "${ROOT}/apps/web"
pnpm build
cd "${ROOT}"

# Build Go
echo -e "${BLUE}🏗️ Building Go backend...${NC}"
cd "${ROOT}/apps/backend-go"
mkdir -p bin
go build -o bin/server cmd/server/main.go
cd "${ROOT}"

# Restart services
echo -e "${BLUE}🔄 Restarting services...${NC}"

pm2 delete backend-go 2>/dev/null || true
pm2 delete web 2>/dev/null || true

pm2 start apps/backend-go/bin/server \
    --name backend-go \
    --cwd "${ROOT}" \
    --log "${ROOT}/logs/backend-go.log" \
    --error "${ROOT}/logs/backend-go-error.log"

cd "${ROOT}/apps/web"
pm2 start npm \
    --name web \
    --cwd "${ROOT}/apps/web" \
    --log "${ROOT}/logs/web.log" \
    --error "${ROOT}/logs/web-error.log" \
    -- start

cd "${ROOT}"

pm2 save
pm2 list

echo -e "${GREEN}✅ Deployment completed!${NC}"
