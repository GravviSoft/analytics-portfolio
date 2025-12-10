# Deployment Options

Your application is now configured for easy deployment with **two options**:

---

## ⭐ Option 1: Docker (RECOMMENDED)

**Why Docker?**
- ✅ Easiest deployment (3 commands)
- ✅ No need to install Node.js on server
- ✅ Automatic restarts
- ✅ Consistent environment
- ✅ Easy updates

**Quick Start:** See [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

**Full Guide:** See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

**Deploy in 3 commands:**
```bash
# On server 148.113.192.64
git clone <repo> anxiously-engaged-dashboard
cd anxiously-engaged-dashboard
docker-compose up -d --build
```

---

## Option 2: Traditional (PM2)

**When to use:**
- You prefer traditional deployment
- You already have Node.js infrastructure
- You need more control over the process

**Quick Start:** See [SERVER_SETUP_QUICKSTART.md](SERVER_SETUP_QUICKSTART.md)

**Full Guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Configuration Summary

### Ports
- **Frontend**: 3005
- **Backend**: 4005

### Server
- **IP**: 148.113.192.64
- **Domain**: (You can point your domain to this IP)

### Local Development
```bash
npm run dev
```
- Frontend: http://localhost:3005
- Backend: http://localhost:4005

---

## Files Created

### Docker Files
- [Dockerfile](Dockerfile) - Frontend container
- [server/Dockerfile](server/Dockerfile) - Backend container
- [docker-compose.yml](docker-compose.yml) - Orchestration
- [nginx.conf](nginx.conf) - Frontend web server config
- [.dockerignore](.dockerignore) - Exclude files from Docker build
- [.env.docker](.env.docker) - Production environment template

### Configuration Files
- [.env.local](.env.local) - Local frontend config
- [.env.production](.env.production) - Production frontend config
- [server/.env](server/.env) - Backend config (local)
- [server/.env.production](server/.env.production) - Backend config (production)

### Documentation
- [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) - 5-minute Docker deploy
- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Complete Docker guide
- [SERVER_SETUP_QUICKSTART.md](SERVER_SETUP_QUICKSTART.md) - Traditional deploy quick start
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete traditional guide

### Code Changes
- [src/constants/globals.js](src/constants/globals.js) - Environment-based API URLs
- [server/server.js](server/server.js) - Environment-based CORS
- [src/components/Analytics/AnalyticsDashboard.js](src/components/Analytics/AnalyticsDashboard.js) - Environment-based server URL
- [src/components/Login.js](src/components/Login.js) - Environment-based API URL

---

## Next Steps

1. **Choose your deployment method** (Docker recommended)
2. **Follow the quickstart guide**
3. **Test your deployment**
4. **Optional: Set up a domain name**
5. **Optional: Add SSL/HTTPS**

---

## Support

If you run into issues:
1. Check the appropriate deployment guide
2. Look at the troubleshooting section
3. Check logs (docker-compose logs or pm2 logs)

---

Good luck with your deployment! 🚀
