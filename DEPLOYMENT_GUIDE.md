# Deployment Guide - React Anxiously Engaged Dashboard

## Server Information
- **Server IP**: 148.113.192.64
- **Frontend Port**: 3005
- **Backend Port**: 4005

## Configuration Overview

This application now supports both **local development** and **production deployment** through environment variables.

### Environment Files

1. **Frontend (.env.local)** - Local development
2. **Frontend (.env.production)** - Production deployment
3. **Backend (server/.env)** - Local development
4. **Backend (server/.env.production)** - Production deployment

---

## Local Development Setup

### Running Locally

1. **Frontend** will use `.env.local`:
   - Port: 3005
   - API URL: http://localhost:4005

2. **Backend** will use `server/.env`:
   - Port: 4005
   - Client URL: http://localhost:3005

### Start Local Development

```bash
# From project root
npm run dev
```

This will start:
- Frontend on http://localhost:3005
- Backend on http://localhost:4005

---

## Production Deployment

### Step 1: Prepare Your Server

SSH into your server:
```bash
ssh root@148.113.192.64
```

### Step 2: Install Dependencies on Server

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx for reverse proxy (optional but recommended)
sudo apt-get install nginx
```

### Step 3: Clone Your Repository

```bash
cd /var/www
git clone <your-repo-url> anxiously-engaged-dashboard
cd anxiously-engaged-dashboard
```

### Step 4: Configure Production Environment

Copy production environment files:

**Backend:**
```bash
cd server
cp .env.production .env
```

Edit if needed:
```bash
nano .env
```

**Frontend:**
```bash
cd ..
cp .env.production .env.production.local
```

### Step 5: Install Dependencies and Build

```bash
# Install frontend dependencies
npm install

# Build frontend for production
npm run build

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 6: Start Backend with PM2

```bash
cd server
pm2 start server.js --name "anxiously-backend"
pm2 save
pm2 startup
```

### Step 7: Serve Frontend

You have two options:

#### Option A: Serve with PM2 and serve package

```bash
npm install -g serve
cd /var/www/anxiously-engaged-dashboard
pm2 start "serve -s build -l 3005" --name "anxiously-frontend"
pm2 save
```

#### Option B: Configure Nginx (Recommended)

Create nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/anxiously-engaged
```

Add this configuration:
```nginx
# Backend API
server {
    listen 4005;
    server_name 148.113.192.64;

    location / {
        proxy_pass http://localhost:4005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 3005;
    server_name 148.113.192.64;

    root /var/www/anxiously-engaged-dashboard/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/anxiously-engaged /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Configure Firewall

```bash
sudo ufw allow 3005
sudo ufw allow 4005
sudo ufw status
```

### Step 9: Verify Deployment

Check if services are running:
```bash
pm2 status
pm2 logs anxiously-backend
```

Test the endpoints:
```bash
curl http://148.113.192.64:4005/health
curl http://148.113.192.64:3005
```

---

## Using a Domain Name

If you want to use a domain instead of IP:

1. **Update DNS**: Point your domain to 148.113.192.64

2. **Update Environment Files**:

   **.env.production** (frontend):
   ```
   REACT_APP_API_URL=http://yourdomain.com:4005
   ```

   **server/.env.production** (backend):
   ```
   CLIENT_URL=http://yourdomain.com:3005
   ```

3. **Rebuild and Restart**:
   ```bash
   npm run build
   pm2 restart anxiously-backend
   ```

---

## SSL/HTTPS Setup (Recommended for Production)

### Install Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### Update Nginx Configuration for HTTPS

```bash
sudo certbot --nginx -d yourdomain.com
```

### Update Environment Variables for HTTPS

**.env.production**:
```
REACT_APP_API_URL=https://yourdomain.com/api
```

Update nginx to proxy `/api` to port 4005.

---

## Common PM2 Commands

```bash
pm2 list                    # List all processes
pm2 logs anxiously-backend  # View logs
pm2 restart anxiously-backend
pm2 stop anxiously-backend
pm2 delete anxiously-backend
pm2 save                    # Save current process list
```

---

## Troubleshooting

### Backend not responding
```bash
pm2 logs anxiously-backend
# Check if PORT_NUM is set correctly in server/.env
```

### Frontend shows connection error
```bash
# Check REACT_APP_API_URL in .env.production.local
# Verify backend is running: curl http://148.113.192.64:4005/health
```

### CORS errors
- Ensure CLIENT_URL in server/.env matches your frontend URL
- Check allowedOrigins in server/server.js

### Can't access from outside
```bash
sudo ufw status
# Make sure ports 3005 and 4005 are allowed
```

---

## Environment Variables Reference

### Frontend (.env.production)
```
REACT_APP_API_URL=http://148.113.192.64:4005
```

### Backend (server/.env.production)
```
PORT_NUM=4005
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=<your-database-connection-string>
```

---

## Quick Deploy Script

Save this as `deploy.sh` on your server:

```bash
#!/bin/bash
cd /var/www/anxiously-engaged-dashboard
git pull
npm install
npm run build
cd server
npm install
pm2 restart anxiously-backend
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

---

## Next Steps

1. Set up SSL/HTTPS with Let's Encrypt
2. Configure a proper domain name
3. Set up automated backups for your database
4. Configure monitoring and alerting
5. Set up CI/CD pipeline for automated deployments

---

## Support

For issues, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Application logs in the browser console
