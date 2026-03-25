# 🛡️ SOVEREIGN HARDENED BACKEND ENGINE
# Multi-stage build for minimal attack surface

# Phase 1: Secure Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (only production)
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
RUN npx prisma generate

# Phase 2: Production Hardened
FROM node:20-alpine AS runner

WORKDIR /app

# 1. Security Environment
ENV NODE_ENV=production
ENV PORT=5000

# 2. Hardening: Install tini for signal handling and remove OS vulnerabilities
RUN apk add --no-cache tini && \
    addgroup -g 1001 -S sovereign && \
    adduser -S sovereign -u 1001 -G sovereign

# 3. Artifact Migration
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# 4. Permissions Hardening
RUN chown -R sovereign:sovereign /app && \
    chmod -R 755 /app

# 5. Runtime Security (Non-root user)
USER sovereign

EXPOSE 5000

# 6. Secure Entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
