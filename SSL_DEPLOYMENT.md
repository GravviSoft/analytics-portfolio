# SSL Deployment Guide - gravvisoft.com

## 🔒 Automatic HTTPS with Caddy

This guide will help you deploy your app with **automatic SSL certificates** from Let's Encrypt using Caddy.

**Benefits:**
- ✅ Automatic SSL certificate from Let's Encrypt
- ✅ Auto-renewal (no manual work needed)
- ✅ HTTP/3 support
- ✅ Automatic HTTP to HTTPS redirect
- ✅ One domain, clean URLs (no ports needed)

---

## Prerequisites

- [x] DNS pointed to 148.113.192.64 ✅ (gravvisoft.com)
- [ ] Ports 80 and 443 open on firewall
- [ ] Docker and Docker Compose installed

---

## Quick Deploy

### 1. SSH into Your Server

```bash
ssh root@148.113.192.64
```

### 2. Install Docker (if not already done)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Configure Firewall

```bash
# Open HTTP and HTTPS ports (required for SSL)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow ssh
sudo ufw enable
sudo ufw status
```

**Important:** Ports 80 and 443 must be open for Let's Encrypt to verify your domain!

### 4. Clone and Configure

```bash
cd /var/www
git clone https://github.com/GravviSoft/analytics-portfolio.git analytics-portfolio
cd analytics-portfolio

# Copy SSL environment file for backend
cd server
cp .env.ssl .env
cd ..
```

### 5. Deploy with SSL

```bash
# Build and start with SSL configuration
docker-compose -f docker-compose.ssl.yml up -d --build
```

### 6. Watch the Magic Happen

```bash
# Watch Caddy automatically get your SSL certificate
docker-compose -f docker-compose.ssl.yml logs -f caddy
```

You'll see Caddy automatically:
1. Request a certificate from Let's Encrypt
2. Verify domain ownership
3. Install the certificate
4. Set up HTTPS

**This takes about 30 seconds!**

---

## Verify Deployment

### Check Container Status
```bash
docker-compose -f docker-compose.ssl.yml ps
```

All containers should be "Up".

### Test Your Site

**In your browser:**
- https://gravvisoft.com (should work with SSL! 🔒)
- http://gravvisoft.com (should redirect to https)
- https://www.gravvisoft.com (should redirect to https://gravvisoft.com)

**From command line:**
```bash
# Test SSL certificate
curl -I https://gravvisoft.com

# Test backend API
curl https://gravvisoft.com/health
```

---

## How It Works

### URL Structure

**Before (with ports):**
- Frontend: http://148.113.192.64:3005
- Backend: http://148.113.192.64:4005

**After (with SSL):**
- Everything: https://gravvisoft.com
- API endpoints: https://gravvisoft.com/analytics/stats, etc.
- Frontend automatically uses https://gravvisoft.com for API calls

### Architecture

```
Internet (HTTPS)
       ↓
Caddy (Port 443) - Automatic SSL
       ↓
├─→ Frontend (Static files)
└─→ Backend (API routes) - Port 4005
```

Caddy handles:
- SSL certificates (automatic)
- HTTPS termination
- Routing /api/* to backend
- Serving frontend static files
- HTTP to HTTPS redirect

---

## Common Commands

### View Logs
```bash
# All logs
docker-compose -f docker-compose.ssl.yml logs -f

# Just Caddy (SSL)
docker-compose -f docker-compose.ssl.yml logs -f caddy

# Just backend
docker-compose -f docker-compose.ssl.yml logs -f backend
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.ssl.yml restart

# Restart just Caddy
docker-compose -f docker-compose.ssl.yml restart caddy
```

### Stop Services
```bash
docker-compose -f docker-compose.ssl.yml down
```

### Update/Redeploy
```bash
cd /var/www/analytics-portfolio
git pull
docker-compose -f docker-compose.ssl.yml up -d --build
```

### Check SSL Certificate
```bash
# View certificate details
docker-compose -f docker-compose.ssl.yml exec caddy caddy trust

# Check certificate expiration
echo | openssl s_client -servername gravvisoft.com -connect gravvisoft.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Troubleshooting

### Certificate Not Working

**Check DNS:**
```bash
# Verify DNS is pointing to your server
nslookup gravvisoft.com
# Should show: 148.113.192.64
```

**Check ports:**
```bash
sudo ufw status
# Ports 80 and 443 must be open
```

**Check Caddy logs:**
```bash
docker-compose -f docker-compose.ssl.yml logs caddy
```

Common issues:
- DNS not propagated yet (wait 5-10 minutes)
- Ports 80/443 not open
- Another service using port 80/443

### "Connection Refused" or "Cannot Connect"

**Check containers are running:**
```bash
docker-compose -f docker-compose.ssl.yml ps
```

**Check firewall:**
```bash
sudo ufw status
# Make sure 80 and 443 are allowed
```

**Check if another service is using port 80/443:**
```bash
sudo lsof -i :80
sudo lsof -i :443

# If something else is using it, stop it first
```

### Backend API Not Working

**Check backend logs:**
```bash
docker-compose -f docker-compose.ssl.yml logs backend
```

**Test backend directly:**
```bash
# From inside the server
curl http://localhost:4005/health
```

**Check CORS configuration:**
Make sure `server/.env` has:
```
CLIENT_URL=https://gravvisoft.com
```

### SSL Certificate Expired (shouldn't happen - auto-renews)

```bash
# Force certificate renewal
docker-compose -f docker-compose.ssl.yml restart caddy
```

Caddy automatically renews certificates 30 days before expiration.

---

## Certificate Auto-Renewal

**Good news:** Caddy handles this automatically!

- Certificates are renewed 30 days before expiration
- No manual intervention needed
- Renewal happens in the background
- Zero downtime

You can verify auto-renewal is working:
```bash
docker-compose -f docker-compose.ssl.yml logs caddy | grep renew
```

---

## Switching Between Configurations

### From Non-SSL to SSL

```bash
# Stop non-SSL version
docker-compose down

# Start SSL version
docker-compose -f docker-compose.ssl.yml up -d --build
```

### From SSL back to Non-SSL (for testing)

```bash
# Stop SSL version
docker-compose -f docker-compose.ssl.yml down

# Start non-SSL version
docker-compose up -d --build
```

---

## Security Best Practices

### 1. Keep Docker Updated
```bash
sudo apt update && sudo apt upgrade
```

### 2. Enable Firewall
```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 3. Regular Backups
Backup your database regularly:
```bash
# Your Neon database is already backed up
# But you should export data periodically
```

### 4. Monitor Logs
```bash
# Set up log monitoring
docker-compose -f docker-compose.ssl.yml logs -f | grep -i error
```

---

## Adding More Subdomains

Want to add `api.gravvisoft.com` or `dashboard.gravvisoft.com`?

Edit `Caddyfile`:
```
# Add a new site
api.gravvisoft.com {
    reverse_proxy backend:4005
}

dashboard.gravvisoft.com {
    root * /srv/frontend
    encode gzip
    file_server
    try_files {path} /index.html
}
```

Then restart:
```bash
docker-compose -f docker-compose.ssl.yml restart caddy
```

Caddy will automatically get certificates for the new subdomains!

---

## Performance Optimization

Caddy already includes:
- ✅ HTTP/2
- ✅ HTTP/3 (QUIC)
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Connection pooling

For additional optimization:
```bash
# Add to Caddyfile under gravvisoft.com:
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "no-referrer-when-downgrade"
    }
```

---

## Quick Reference

### Deploy/Update
```bash
cd /var/www/analytics-portfolio
git pull
docker-compose -f docker-compose.ssl.yml up -d --build
```

### Check Status
```bash
docker-compose -f docker-compose.ssl.yml ps
curl -I https://gravvisoft.com
```

### View Logs
```bash
docker-compose -f docker-compose.ssl.yml logs -f
```

### Restart
```bash
docker-compose -f docker-compose.ssl.yml restart
```

---

## Complete Deployment Script

Save this as `deploy-ssl.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying gravvisoft.com with SSL..."

# Navigate to project
cd /var/www/analytics-portfolio

# Pull latest code
echo "📥 Pulling latest code..."
git pull

# Copy SSL environment
echo "⚙️  Configuring environment..."
cp server/.env.ssl server/.env

# Build and deploy
echo "🔨 Building and deploying..."
docker-compose -f docker-compose.ssl.yml up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo "✅ Checking status..."
docker-compose -f docker-compose.ssl.yml ps

# Test
echo "🧪 Testing HTTPS..."
curl -I https://gravvisoft.com

echo "✨ Deployment complete!"
echo "Visit: https://gravvisoft.com"
```

Make it executable:
```bash
chmod +x deploy-ssl.sh
```

Run it:
```bash
./deploy-ssl.sh
```

---

## Summary

**Your app is now:**
- 🔒 Secured with HTTPS
- 🚀 Served from https://gravvisoft.com
- 🔄 Auto-renewing SSL certificates
- 🌐 Accessible worldwide with a clean URL

**No more port numbers!**
- ~~http://148.113.192.64:3005~~ → https://gravvisoft.com
- ~~http://148.113.192.64:4005/api~~ → https://gravvisoft.com/analytics/stats

Everything just works! 🎉
