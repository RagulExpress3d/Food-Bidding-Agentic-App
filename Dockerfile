# Multi-stage build for Vite React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install Node.js for runtime env injection
RUN apk add --no-cache nodejs npm

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy env injection script
COPY scripts/inject-env.js /usr/local/bin/inject-env.js

# Create startup script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'node /usr/local/bin/inject-env.js' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
