#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  KSW TechZone Docker Deployment"
echo "========================================="
echo ""

# ─── Pre-flight checks ────────────────────────────────────────
if [ ! -f .env ]; then
    echo "[ERROR] .env file not found. Copy .env.example to .env and configure."
    echo "        cp .env.example .env && nano .env"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "[ERROR] Docker Compose plugin is not installed."
    exit 1
fi

# ─── Load environment ──────────────────────────────────────────
set -a
source .env
set +a

COMPOSE_FILE="docker-compose.yml"
if [ -f "docker-compose.prod.yml" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# ─── Git pull (skip if no remote or in detached HEAD) ──────────
if git rev-parse --abbrev-ref HEAD 2>/dev/null | grep -qv 'HEAD'; then
    echo "[INFO] Pulling latest code..."
    git pull origin "$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null || echo "[WARN] Git pull failed, continuing with local code."
else
    echo "[INFO] Skipping git pull (detached HEAD or not a git repository)."
fi

# ─── Backup database ──────────────────────────────────────────
echo "[INFO] Backing up database..."
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/ksw-$(date +%Y%m%d-%H%M%S).sql"

if docker compose -f "$COMPOSE_FILE" ps postgres --format json 2>/dev/null | grep -q "running"; then
    docker compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U "${POSTGRES_USER:-ksw}" "${POSTGRES_DB:-ksw_website}" > "$BACKUP_FILE" || echo "[WARN] Database backup failed, continuing."
    gzip "$BACKUP_FILE" 2>/dev/null || true
    echo "[INFO] Backup saved: ${BACKUP_FILE}.gz"
else
    echo "[INFO] Postgres not running, skipping backup."
fi

# ─── Pull latest images ───────────────────────────────────────
echo "[INFO] Pulling base images..."
docker compose -f "$COMPOSE_FILE" pull --ignore-buildable

# ─── Rebuild and deploy ───────────────────────────────────────
echo "[INFO] Rebuilding and starting services..."
docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

# ─── Run database migrations ──────────────────────────────────
echo "[INFO] Running database migrations..."
if docker compose -f "$COMPOSE_FILE" exec -T frontend npx prisma migrate deploy 2>/dev/null; then
    echo "[INFO] Migrations applied successfully."
else
    echo "[WARN] Migration command failed. The app may still start if schema is up-to-date."
fi

# ─── Cleanup ───────────────────────────────────────────────────
echo "[INFO] Cleaning up old images..."
docker image prune -f

# ─── Health check ─────────────────────────────────────────────
echo "[INFO] Checking service health..."
sleep 5

FAILED=0
for SERVICE in postgres frontend nginx; do
    STATUS=$(docker compose -f "$COMPOSE_FILE" ps "$SERVICE" --format json 2>/dev/null | grep -o '"Status":"[^"]*"' | head -1 || echo "")
    if echo "$STATUS" | grep -qi "running"; then
        echo "  [OK] $SERVICE is running"
    else
        echo "  [FAIL] $SERVICE is not running"
        FAILED=1
    fi
done

if [ "$FAILED" -eq 0 ]; then
    echo ""
    echo "[SUCCESS] Deployment complete!"
    echo "  Site:    ${NEXT_PUBLIC_APP_URL:-http://localhost}"
    echo "  Monitor: docker compose -f $COMPOSE_FILE logs -f"
else
    echo ""
    echo "[WARN] Some services failed. Check logs:"
    echo "  docker compose -f $COMPOSE_FILE logs"
fi
