# Quick Server Setup - 148.113.192.64

## Pre-Deployment Checklist

- [ ] Server has Node.js installed
- [ ] Ports 3005 and 4005 are open on firewall
- [ ] Git repository is accessible from server
- [ ] Database connection string is correct

## One-Time Server Setup

```bash
# SSH into server
ssh root@148.113.192.64

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo apt-get install nginx

# Configure firewall
sudo ufw allow 3005
sudo ufw allow 4005
sudo ufw allow ssh
sudo ufw enable
```

## Deploy Application

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> anxiously-engaged-dashboard
cd anxiously-engaged-dashboard

# Setup backend environment
cd server
cp .env.production .env
# Edit .env if needed: nano .env
npm install
cd ..

# Setup frontend environment
cp .env.production .env.production.local
npm install

# Build frontend
npm run build

# Start backend with PM2
cd server
pm2 start server.js --name "anxiously-backend"
pm2 save
pm2 startup  # Follow the instructions it gives you

# Option 1: Serve frontend with serve
cd ..
npm install -g serve
pm2 start "serve -s build -l 3005" --name "anxiously-frontend"
pm2 save
```

## Verify Deployment

```bash
# Check PM2 processes
pm2 status

# Test backend
curl http://148.113.192.64:4005/health

# View logs
pm2 logs
```

## Access Your Application

- Frontend: http://148.113.192.64:3005
- Backend API: http://148.113.192.64:4005

## Update/Redeploy

```bash
cd /var/www/anxiously-engaged-dashboard
git pull
npm install
npm run build
cd server
npm install
pm2 restart anxiously-backend
```

## Useful Commands

```bash
pm2 list              # List all processes
pm2 logs              # View logs
pm2 restart all       # Restart all processes
pm2 stop all          # Stop all processes
```

## Current Configuration

### Ports
- Frontend: 3005
- Backend: 4005

### Environment Variables (Production)

**Frontend (.env.production.local):**
```
REACT_APP_API_URL=http://148.113.192.64:4005
```

**Backend (server/.env):**
```
PORT_NUM=4005
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=<your-connection-string>
```

## Local Development

To run locally on your machine:

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3005
- Backend: http://localhost:4005

The local environment will automatically use `.env.local` and `server/.env` with localhost URLs.
