FROM node:18-alpine

WORKDIR /app

# Install Python and build tools needed for native dependencies like bcrypt
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose backend port
EXPOSE 4005

# Start the server
CMD ["node", "server.js"]
