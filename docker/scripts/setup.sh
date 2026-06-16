#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  KSW TechZone — First-Time VPS Setup"
echo "========================================="
echo ""

# ─── Pre-flight ───────────────────────────────────────────────
if [ "$EUID" -eq 0 ]; then
    echo "[WARN] Running as root. It's better to run as a regular user with docker access."
fi

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker not found. Install it first:"
    echo "  curl -fsSL https://get.docker.com | sudo sh"
    exit 1
fi

if [ ! -f .env ]; then
    echo "[ERROR] .env file not found."
    echo "  cp .env.example .env"
    echo "  Then edit .env with your secrets."
    exit 1
fi

# ─── Ensure Docker Compose plugin ────────────────────────────
if ! docker compose version &> /dev/null; then
    echo "[ERROR] Docker Compose plugin not found."
    echo "  sudo apt install -y docker-compose-plugin"
    exit 1
fi

# ─── Create required directories ─────────────────────────────
mkdir -p docker/nginx/ssl backups logs

# ─── Start infrastructure ────────────────────────────────────
echo "[1/5] Starting databases..."
docker compose up -d postgres redis

echo "[2/5] Waiting for postgres to be healthy..."
docker compose wait postgres 2>/dev/null || sleep 10

echo "[3/5] Building and starting frontend..."
docker compose up -d --build frontend

echo "[4/5] Running database migrations..."
docker compose exec -T frontend npx prisma migrate deploy || echo "[WARN] Migration issue — you may need to run this manually."

echo "[5/5] Starting nginx (SSL will be configured next)..."
docker compose up -d nginx

echo ""
echo "========================================="
echo "  SSL Certificate Setup"
echo "========================================="
echo ""
echo "To get an SSL certificate, run:"
echo ""
echo "  docker compose run --rm certbot certonly --webroot \\"
echo "    -w /var/www/certbot \\"
echo "    -d kswtechzone.com -d www.kswtechzone.com \\"
echo "    --email admin@kswtechzone.com --agree-tos --no-eff-email"
echo ""
echo "Then start all services:"
echo "  docker compose up -d"
echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
