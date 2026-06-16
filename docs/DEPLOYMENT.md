# VPS Deployment Guide — Ubuntu (No Docker)

## 1. System Update & Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib ufw fail2ban
```

## 2. Install Node.js 20 + pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x

# Install pnpm globally
corepack enable && corepack prepare pnpm@latest --activate
pnpm -v
```

## 3. Configure PostgreSQL

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql -c "CREATE USER ksw WITH PASSWORD 'your_strong_password';"
sudo -u postgres psql -c "CREATE DATABASE ksw_website OWNER ksw;"
sudo -u postgres psql -c "ALTER USER ksw CREATEDB;"

# Allow password auth for local connections
sudo sed -i 's/local\s\+all\s\+all\s\+peer/local   all             all                                     md5/' /etc/postgresql/16/main/pg_hba.conf
sudo systemctl restart postgresql
```

## 4. Clone & Configure App

```bash
sudo mkdir -p /var/www/kswtechzone
sudo chown -R $USER:$USER /var/www/kswtechzone
git clone https://github.com/kswtechzone/ksw-techzone.git /var/www/kswtechzone
cd /var/www/kswtechzone

# Environment file
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://ksw:your_strong_password@localhost:5432/ksw_website"

# JWT (use a real random secret)
JWT_SECRET="generate-with-openssl-rand-64-hex"
ADMIN_SECRET="generate-another-random-secret"

# Next.js
NEXT_PUBLIC_APP_URL="https://kswtechzone.com"
NEXT_PUBLIC_API_URL="/api"
NODE_ENV=production
PORT=3000

# Admin credentials (first-run only)
ADMIN_EMAIL="admin@kswtechzone.com"
ADMIN_PASSWORD="change-me-on-first-login"

# EmailJS (contact form)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=""
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=""
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=""
EMAILJS_PRIVATE_KEY=""

# Email (nodemailer — newsletter, notifications)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
CONTACT_EMAIL="contact@kswtechzone.com"
EOF

pnpm install
npx prisma generate
npx prisma migrate deploy

# Seed initial admin (optional)
pnpm db:seed
```

## 5. Build the App

```bash
cd /var/www/kswtechzone
pnpm run build
```

## 6. Install pm2 & Start App

```bash
npm install -g pm2

pm2 start pnpm --name ksw-techzone -- start
pm2 save
pm2 startup   # prints a command — run it to enable on reboot
```

## 7. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/kswtechzone
```

```nginx
server {
    listen 80;
    server_name kswtechzone.com www.kswtechzone.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 60s;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/kswtechzone /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d kswtechzone.com -d www.kswtechzone.com
# Auto-renewal is enabled by default; test with:
sudo certbot renew --dry-run
```

## 9. Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## 10. Deploy Updates

```bash
cd /var/www/kswtechzone
git pull origin main
pnpm install
npx prisma generate
npx prisma migrate deploy
pnpm run build
pm2 restart ksw-techzone
```

## Useful Commands

```bash
# Logs
pm2 logs ksw-techzone
journalctl -u nginx --no-pager -n 50

# Status
pm2 status
sudo systemctl status nginx postgresql

# Database backup
pg_dump -U ksw ksw_website > /backup/ksw-$(date +%Y%m%d).sql

# Restore
psql -U ksw -d ksw_website < backup.sql
```

## Security Checklist

- [ ] All secrets in `.env` — never commit
- [ ] JWT_SECRET generated with `openssl rand -hex 64`
- [ ] PostgreSQL port (5432) blocked by UFW — only local access
- [ ] SSH key-only authentication (`/etc/ssh/sshd_config`)
- [ ] Fail2ban running: `sudo systemctl status fail2ban`
- [ ] Regular backups: add cron job (`crontab -e`)
- [ ] OS auto-updates: `sudo apt install unattended-upgrades`
