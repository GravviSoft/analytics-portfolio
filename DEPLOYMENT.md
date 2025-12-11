# Deployment Guide

Simple Docker deployment with nginx handling SSL and routing.

## Prerequisites
- Docker and Docker Compose installed
- SSL certificates from Let's Encrypt at `/etc/letsencrypt/live/gravvisoft.com/`

## Architecture

```
Internet → nginx (Port 80/443) → React App (static files)
                                → Backend API (proxy to port 4005)
```

Everything runs in Docker. No external reverse proxy needed.

## Server Deployment Steps

### 1. Ensure SSL Certificates Exist
```bash
# Check certificates
ls -la /etc/letsencrypt/live/gravvisoft.com/

# Should see:
# - fullchain.pem
# - privkey.pem
```

If missing, set up Let's Encrypt:
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d gravvisoft.com -d www.gravvisoft.com
```

### 2. Stop Any Conflicting Services
```bash
# Stop Caddy if running
sudo systemctl stop caddy
# OR
sudo killall caddy

# Make sure ports 80 and 443 are free
sudo lsof -i :80
sudo lsof -i :443
```

### 3. Deploy Application
```bash
cd ~/analytics-portfolio
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
```

### 4. Verify Deployment
```bash
# Check containers are running
docker ps

# Should see:
# - anxiously-frontend (ports 80->80, 443->443)
# - anxiously-backend (port 4005->4005)

# Check logs
docker logs anxiously-frontend
docker logs anxiously-backend

# Test the site
curl -I https://gravvisoft.com
```

## Configuration

### nginx handles:
- SSL/TLS termination (ports 80, 443)
- HTTP → HTTPS redirect
- Static file serving (React app)
- API proxy (`/api/*` → `backend:4005`)
- Gzip compression
- Cache headers

### SSL Certificates
Certificates are mounted read-only from Let's Encrypt:
- `/etc/letsencrypt/live/gravvisoft.com/` → `/etc/nginx/ssl/`

To renew certificates:
```bash
# Stop frontend temporarily
docker stop anxiously-frontend

# Renew certificates
sudo certbot renew

# Start frontend
docker start anxiously-frontend
```

## Troubleshooting

### Changes not appearing
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check container: `docker ps`
3. Check build: `docker exec anxiously-frontend ls -la /usr/share/nginx/html`
4. Check nginx: `docker logs anxiously-frontend`

### SSL errors
1. Check certificate paths: `ls -la /etc/letsencrypt/live/gravvisoft.com/`
2. Check nginx logs: `docker logs anxiously-frontend`
3. Verify volume mount: `docker inspect anxiously-frontend`

### Port conflicts
```bash
# Find what's using ports
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop caddy
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Build failures
- Check logs: `docker compose logs`
- Rebuild: `docker compose build --no-cache`
- Check disk space: `df -h`
