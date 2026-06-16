#!/bin/bash

set -e

echo "KSW TechZone Deployment Script"
echo "================================"

# Check environment
if [ ! -f .env ]; then
    echo ".env file not found. Copy .env.example to .env and configure."
    exit 1
fi

# Load environment
source .env

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Build and deploy
echo "Building and deploying..."
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml build --no-cache
docker compose -f docker-compose.yml up -d

# Run database migrations
echo "Running database migrations..."
docker compose exec -T frontend npx prisma migrate deploy

# Cleanup old images
echo "Cleaning up old images..."
docker image prune -f

# Check health
echo "Checking service health..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend is healthy"
else
    echo "Frontend health check failed"
fi

echo "Deployment complete!"
echo "Monitor: docker compose logs -f"
