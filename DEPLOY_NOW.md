# 🚀 Deploy gravvisoft.com NOW

## Copy & Paste These Commands

### 1. SSH into Your Server
```bash
ssh root@148.113.192.64
```

### 2. Install Docker (if needed)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Open Firewall Ports
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow ssh
sudo ufw enable
```

### 4. Clone Repository
```bash
cd /var/www
git clone https://github.com/GravviSoft/analytics-portfolio.git analytics-portfolio
cd analytics-portfolio
```

### 5. Configure Environment
```bash
cd server
cp .env.ssl .env
cd ..
```

### 6. Deploy with SSL! 🔒
```bash
docker-compose -f docker-compose.ssl.yml up -d --build
```

### 7. Watch it Work
```bash
docker-compose -f docker-compose.ssl.yml logs -f caddy
```

Wait about 30 seconds for SSL certificate to be issued.

### 8. Test Your Site! 🎉

Open in browser: **https://gravvisoft.com**

---

## That's It!

Your app is now live at:
- https://gravvisoft.com

With:
- ✅ Automatic HTTPS (SSL)
- ✅ Auto-renewing certificates
- ✅ Clean URLs (no port numbers)
- ✅ HTTP to HTTPS redirect

---

## Update Later

```bash
cd /var/www/analytics-portfolio
git pull
docker-compose -f docker-compose.ssl.yml up -d --build
```

---

## Troubleshooting

**If SSL doesn't work:**
1. Wait 5 minutes for DNS to propagate
2. Check ports: `sudo ufw status`
3. Check logs: `docker-compose -f docker-compose.ssl.yml logs caddy`

**If you see errors:**
See [SSL_DEPLOYMENT.md](SSL_DEPLOYMENT.md) for detailed troubleshooting.

---

**Need help?** Check the logs first:
```bash
docker-compose -f docker-compose.ssl.yml logs -f
```
