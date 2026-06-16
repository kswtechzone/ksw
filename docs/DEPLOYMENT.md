# VPS Deployment Guide — Ubuntu (Docker)

## Prerequisites

- Ubuntu 22.04+ VPS with root/sudo access
- Domain `kswtechzone.com` pointing to the server IP
- Ports 22, 80, 443 open in the firewall

---

## 1. System Setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban
```

## 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker  # or log out and back in
sudo systemctl enable docker
```

## 3. Install Docker Compose Plugin

```bash
sudo apt install -y docker-compose-plugin
docker compose version
```

## 4. Clone the Repository

```bash
sudo mkdir -p /var/www/kswtechzone
sudo chown -R $USER:$USER /var/www/kswtechzone
git clone <repo-url> /var/www/kswtechzone
cd /var/www/kswtechzone
```

## 5. Configure Environment

```bash
cp .env.example .env
nano .env
```

Set:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://ksw:<password>@postgres:5432/ksw_website` (host = Docker service name) |
| `REDIS_URL` | `redis://redis:6379` |
| `JWT_SECRET` | `openssl rand -hex 64` |
| `SMTP_*` | Your SMTP credentials |
| `POSTGRES_PASSWORD` | Same password used in `DATABASE_URL` |
| `NEXT_PUBLIC_APP_URL` | `https://kswtechzone.com` |

## 6. First-Time Launch

```bash
docker compose up -d postgres redis
docker compose up -d frontend
docker compose exec -T frontend npx prisma migrate deploy
docker compose exec -T frontend npx prisma db seed
```

### SSL Certificate (First Time)

```bash
# Stop nginx if running
docker compose stop nginx

# Run certbot manually to get the certificate
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d kswtechzone.com -d www.kswtechzone.com \
  --email admin@kswtechzone.com --agree-tos --no-eff-email

# Start all services
docker compose up -d
```

## 7. Deployment Script

```bash
chmod +x docker/scripts/deploy.sh
./docker/scripts/deploy.sh
```

## 8. Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 9. Monitoring & Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend

# Resource usage
docker stats
```

## 10. Updates

```bash
cd /var/www/kswtechzone
git pull origin main
./docker/scripts/deploy.sh
```

## 11. Backup & Restore

### Backup

```bash
docker compose exec -T postgres pg_dump -U ksw ksw_website > backup-$(date +%Y%m%d).sql
```

### Restore

```bash
cat backup.sql | docker compose exec -T postgres psql -U ksw -d ksw_website
```

## Useful Commands

```bash
# Rebuild frontend (after code changes)
docker compose up -d --build frontend

# Run migrations
docker compose exec -T frontend npx prisma migrate deploy

# Open psql shell
docker compose exec -T postgres psql -U ksw -d ksw_website

# Renew SSL (automatic via certbot container every 12h)
docker compose logs certbot

# Clean up
docker compose down
docker system prune -a
```

## Security Checklist

- [ ] All secrets in `.env` — never commit
- [ ] `JWT_SECRET` generated with `openssl rand -hex 64`
- [ ] PostgreSQL port (5432) bound only to `127.0.0.1`
- [ ] Redis port (6379) bound only to `127.0.0.1`
- [ ] SSH key-only authentication (`/etc/ssh/sshd_config`)
- [ ] Fail2ban running: `sudo systemctl status fail2ban`
- [ ] Regular backups: add cron job (`crontab -e`)
- [ ] OS auto-updates: `sudo apt install unattended-upgrades`
- [ ] Docker not exposed via TCP (no `-H tcp://` in daemon config)
