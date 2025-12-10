# Docker Deployment Guide

## Why Docker?

Docker makes deployment **much simpler**:
- ✅ No need to install Node.js, npm, or dependencies on the server
- ✅ Consistent environment across development and production
- ✅ Easy updates with `docker-compose pull && docker-compose up -d`
- ✅ Automatic restarts if the app crashes
- ✅ Isolated environment - won't conflict with other services

---

## Prerequisites

Your server needs:
- Docker
- Docker Compose
- Ports 3005 and 4005 open

---

## One-Time Server Setup

### 1. SSH into Your Server

```bash
ssh root@148.113.192.64
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Configure Firewall

```bash
sudo ufw allow 3005
sudo ufw allow 4005
sudo ufw allow ssh
sudo ufw enable
sudo ufw status
```

---

## Deploy Your Application

### 1. Clone Your Repository

```bash
cd /var/www
git clone <your-repo-url> anxiously-engaged-dashboard
cd anxiously-engaged-dashboard
```

### 2. Create Production Environment File

```bash
# Copy the template
cp .env.docker .env.docker.local

# Edit with your production values
nano .env.docker.local
```

Update `.env.docker.local`:
```bash
# Frontend API URL (what the browser uses)
REACT_APP_API_URL=http://148.113.192.64:4005

# Backend Configuration
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=<your-database-connection-string>
```

Also create `server/.env`:
```bash
cd server
nano .env
```

Add:
```bash
PORT_NUM=4005
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=<your-database-connection-string>
```

### 3. Build and Start the Application

```bash
cd /var/www/anxiously-engaged-dashboard

# Build and start in detached mode
docker-compose --env-file .env.docker.local up -d --build
```

### 4. Verify It's Running

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test backend
curl http://148.113.192.64:4005/health

# Test frontend
curl http://148.113.192.64:3005
```

---

## Access Your Application

- **Frontend**: http://148.113.192.64:3005
- **Backend API**: http://148.113.192.64:4005/health

---

## Common Commands

### View Logs
```bash
# All logs
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart everything
docker-compose restart

# Restart just backend
docker-compose restart backend

# Restart just frontend
docker-compose restart frontend
```

### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (CAUTION: removes data)
docker-compose down -v
```

### Update/Redeploy
```bash
cd /var/www/anxiously-engaged-dashboard

# Pull latest code
git pull

# Rebuild and restart
docker-compose --env-file .env.docker.local up -d --build

# Or just rebuild one service
docker-compose build backend
docker-compose up -d backend
```

### Check Resource Usage
```bash
docker stats
```

### Clean Up Old Images
```bash
docker system prune -a
```

---

## Local Development with Docker

You can also run the app locally with Docker:

### Option 1: Use npm (current method)
```bash
npm run dev
```

### Option 2: Use Docker locally
```bash
# Create local env file
cp .env.local .env.docker.local

# Make sure it has localhost URLs
# REACT_APP_API_URL=http://localhost:4005
# CLIENT_URL=http://localhost:3005

# Run with Docker
docker-compose --env-file .env.docker.local up --build
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
sudo lsof -i :4005
sudo lsof -i :3005

# Kill the process or stop docker-compose
docker-compose down
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down
docker-compose up -d --build --force-recreate
```

### Environment Variables Not Working
```bash
# Make sure .env.docker.local exists
ls -la .env.docker.local

# Make sure server/.env exists
ls -la server/.env

# Rebuild with fresh env
docker-compose down
docker-compose --env-file .env.docker.local up -d --build
```

### Can't Connect from Browser
```bash
# Check firewall
sudo ufw status

# Check containers are running
docker-compose ps

# Check logs for errors
docker-compose logs
```

### Database Connection Issues
```bash
# Check backend logs
docker-compose logs backend

# Verify CONNECTION_STRING in server/.env
cat server/.env
```

---

## Production Best Practices

### 1. Use a Domain Name

Update your `.env.docker.local`:
```bash
REACT_APP_API_URL=http://yourdomain.com:4005
CLIENT_URL=http://yourdomain.com:3005
```

### 2. Set Up SSL/HTTPS

Add a reverse proxy (nginx or Caddy) in front:

**nginx reverse proxy**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3005;
    }

    location /api {
        proxy_pass http://localhost:4005;
    }
}
```

Then get SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 3. Enable Auto-Restart

Docker Compose already has `restart: unless-stopped` configured, so containers will auto-restart on failure or server reboot.

### 4. Set Up Automated Backups

Create a backup script for your database.

### 5. Monitor Resources

```bash
# Install monitoring
docker run -d -p 9090:9090 prom/prometheus

# Or use simple monitoring
watch -n 5 docker stats
```

---

## Comparison: Docker vs Traditional Deployment

| Task | Traditional | Docker |
|------|-------------|--------|
| Install Node.js | Required | Not needed |
| Install dependencies | `npm install` on server | Built into image |
| Environment setup | Manual .env files | Single .env.docker.local |
| Start app | PM2 setup | `docker-compose up -d` |
| Restart app | `pm2 restart` | `docker-compose restart` |
| Update app | `git pull && npm install && pm2 restart` | `git pull && docker-compose up -d --build` |
| View logs | `pm2 logs` | `docker-compose logs` |
| Server reboot | Configure PM2 startup | Automatic (restart: unless-stopped) |

---

## Quick Reference

### Deploy/Update
```bash
cd /var/www/anxiously-engaged-dashboard
git pull
docker-compose --env-file .env.docker.local up -d --build
```

### Check Status
```bash
docker-compose ps
docker-compose logs -f
```

### Restart
```bash
docker-compose restart
```

### Stop
```bash
docker-compose down
```

---

## Need Help?

**Check logs first:**
```bash
docker-compose logs -f
```

**Common issues:**
- Port conflicts: `docker-compose down` then try again
- Environment variables: Check `.env.docker.local` and `server/.env`
- CORS errors: Verify `CLIENT_URL` matches your frontend URL
- Build errors: Try `docker system prune -a` then rebuild

---

## Next Steps

1. ✅ Deploy with Docker
2. Set up a domain name
3. Add SSL/HTTPS with certbot
4. Set up monitoring
5. Configure automated backups

Your application is now running in Docker containers with automatic restarts and easy updates! 🚀
