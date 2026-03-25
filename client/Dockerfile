# 🛡️ SOVEREIGN HARDENED FRONTEND (NextJS/Vite)
# Multi-stage build for ultimate security

# Phase 1: High-Speed Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy lockfiles and build logic
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Phase 2: Production Hardened Serving
FROM nginx:1.25-alpine AS runner

# 1. OS Hardening: Install security dependencies and create non-root user
RUN apk add --no-cache curl tzdata && \
    addgroup -g 1001 -S sovereign && \
    adduser -S sovereign -u 1001 -G sovereign && \
    touch /var/run/nginx.pid && \
    chown -R sovereign:sovereign /var/run/nginx.pid /var/cache/nginx /var/log/nginx

# 2. Hardened Nginx Configuration
COPY nginx/nginx-hardened.conf /etc/nginx/conf.d/default.conf

# 3. Artifact Migration
COPY --from=builder /app/dist /usr/share/nginx/html

# 4. Port Hardening (Nginx usually uses 80, but we use 8080 for non-root)
EXPOSE 8080

USER sovereign

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
