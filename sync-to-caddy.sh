#!/bin/bash
# Script to sync Docker build to Caddy's serving directory

# Create the directory if it doesn't exist
sudo mkdir -p /srv/frontend

# Copy files from Docker container to Caddy's directory
docker cp anxiously-frontend:/usr/share/nginx/html/. /srv/frontend/

echo "✅ Synced build files to /srv/frontend"
echo "Files copied:"
ls -la /srv/frontend/ | head -20
