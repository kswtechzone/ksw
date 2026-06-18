# VPS Deployment Guide — Ubuntu (PM2 + Nginx)

## Prerequisites

- Ubuntu 22.04+ VPS with root/sudo access
- Domain `kswtechzone.com` pointing to the server IP
- Ports 22, 80, 443 open in the firewall

---

## 1. System Setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban nginx certbot python3-certbot-nginx
```

## 2. Install Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## 3. Install pnpm & PM2

```bash
sudo npm install -g pnpm pm2
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

Set all required variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://ksw:<password>@localhost:5432/ksw_website` | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `JWT_SECRET` | `openssl rand -hex 64` | JWT signing (generate with the command) |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | `your-email@gmail.com` | SMTP username |
| `SMTP_PASS` | `your-app-password` | SMTP password (Gmail app password) |
| `SMTP_FROM` | `"KSW TechZone <noreply@kswtechzone.com>"` | Sender address |
| `ADMIN_EMAIL` | `admin@example.com` | Contact form notifications go here |
| `NEXT_PUBLIC_APP_URL` | `https://kswtechzone.com` | Public site URL |
| `NEXT_PUBLIC_SITE_URL` | `https://kswtechzone.com` | Used in email links (same as APP_URL) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@kswtechzone.com` | Displayed on contact page |
| `NEXT_PUBLIC_CONTACT_PHONE` | `+977-9863198323` | Displayed on contact page |
| `CORS_ORIGINS` | `https://kswtechzone.com` | Allowed CORS origins (comma-separated if multiple) |

## 6. First-Time Launch

```bash
# Install dependencies & build
pnpm install
npx prisma generate
pnpm run build

# Run database migrations
npx prisma migrate deploy

# Seed initial data (admin user, products, jobs, etc.)
npx prisma db seed

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # (follow the printed command to enable on boot)
```

> **Admin login**: On first login from a new device, a 6-digit verification code is sent via email (SMTP required). If SMTP is not configured, the code is printed in the PM2 logs — run `pm2 logs ksw-frontend` to find it.

### SSL Certificate

```bash
sudo certbot --nginx -d kswtechzone.com -d www.kswtechzone.com \
  --email kswtechzone@gmail.com --agree-tos --no-eff-email
```

### Nginx Configuration

```bash
sudo cp nginx/kswtechzone.conf /etc/nginx/sites-available/kswtechzone.conf
sudo ln -sf /etc/nginx/sites-available/kswtechzone.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## 7. Deployment Script

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
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
# Application logs
pm2 logs ksw-frontend

# PM2 status
pm2 status

# Resource usage
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 10. Updates

```bash
cd /var/www/kswtechzone
git pull origin main
./scripts/deploy.sh
```

## 11. Backup & Restore

### Backup

```bash
pg_dump -U ksw -h localhost ksw_website > backup-$(date +%Y%m%d).sql
```

### Restore

```bash
psql -U ksw -h localhost -d ksw_website < backup.sql
```

## Useful Commands

```bash
# Rebuild frontend (after code changes)
pnpm run build && pm2 reload ksw-frontend

# Run migrations
npx prisma migrate deploy

# Seed database (safe — uses upsert, won't duplicate)
pnpm run db:seed

# Open psql shell
psql -U ksw -h localhost -d ksw_website

# Renew SSL (automatic via certbot timer)
sudo certbot renew

# Stop/start application
pm2 stop ksw-frontend
pm2 start ksw-frontend
pm2 restart ksw-frontend

# Clean up old builds
rm -rf .next
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
