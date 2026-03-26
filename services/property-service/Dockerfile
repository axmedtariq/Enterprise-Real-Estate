# 🛡️ SOVEREIGN HARDENED ENGINE (Node.js)
# Phase 1: High-Speed Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy lockfiles and build logic
COPY package*.json ./
RUN npm install

# Copy source and build (if TS is used)
COPY . .
# RUN npm run build # Uncomment if using TypeScript/Dist structure

# Phase 2: Production Hardened Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# OS Hardening: Create non-root user
RUN addgroup -g 1001 -S sovereign && \
    adduser -S sovereign -u 1001 -G sovereign

# Copy dependencies and source
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# ⚡ Port Hardening
EXPOSE 5002

USER sovereign

CMD ["node", "src/index.js"]
