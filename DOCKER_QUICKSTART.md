# Docker Quick Start - Deploy in 5 Minutes

## On Your Server (148.113.192.64)

### 1. Install Docker (One-Time Setup)
```bash
ssh root@148.113.192.64

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Open firewall ports
sudo ufw allow 3005
sudo ufw allow 4005
```

### 2. Deploy Your App
```bash
# Clone repository
cd /var/www
git clone https://github.com/GravviSoft/React_Anxiously_Engaged_Dashboard.git
cd anxiously-engaged-dashboard

# Create server .env file
cd server
cat > .env << 'EOF'
PORT_NUM=4005
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=postgresql://beau:2Tb6zZEHItar@ep-odd-glade-90791390-pooler.us-west-2.aws.neon.tech/leadfactorydb?sslmode=require&channel_binding=require
EOF
cd ..

# Create production env file
cat > .env.docker.local << 'EOF'
REACT_APP_API_URL=http://148.113.192.64:4005
CLIENT_URL=http://148.113.192.64:3005
CONNECTION_STRING=postgresql://beau:2Tb6zZEHItar@ep-odd-glade-90791390-pooler.us-west-2.aws.neon.tech/leadfactorydb?sslmode=require&channel_binding=require
EOF

# Build and start
docker-compose --env-file .env.docker.local up -d --build
```

### 3. Verify
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Test
curl http://148.113.192.64:4005/health
```

### 4. Access Your App
- Frontend: http://148.113.192.64:3005
- Backend: http://148.113.192.64:4005

---

## Update Your App
```bash
cd /var/www/anxiously-engaged-dashboard
git pull
docker-compose --env-file .env.docker.local up -d --build
```

---

## Useful Commands
```bash
docker-compose logs -f           # View logs
docker-compose restart           # Restart all
docker-compose restart backend   # Restart backend only
docker-compose down              # Stop all
docker-compose ps                # Check status
```

---

## Run Locally with Docker
```bash
# From your local machine
docker-compose up --build
```

Accesses:
- Frontend: http://localhost:3005
- Backend: http://localhost:4005

---

That's it! Your app is now running in Docker with automatic restarts. 🚀

For detailed docs, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
