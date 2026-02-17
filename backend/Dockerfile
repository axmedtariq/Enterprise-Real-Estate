# STAGE 1: THE FORGE (BUILD)
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and compile TypeScript
COPY . .
RUN npm run build 

# STAGE 2: THE TERMINAL (PRODUCTION)
FROM node:18-alpine AS runner

WORKDIR /app

# Set Sovereign Environment
ENV NODE_ENV=production

# Security: Create a dedicated non-privileged user and group
RUN addgroup -S sovereign && adduser -S sovereign -G sovereign

# Only bring over the essentials for the 1.5M network
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# If you have static assets or templates
# COPY --from=builder /app/public ./public 

# Install only production dependencies (no dev-tools, no vulnerabilities)
RUN npm install --omit=dev && \
    chown -R sovereign:sovereign /app

# Security: Run as non-privileged user
USER sovereign

EXPOSE 5000

# Use the compiled entry point
CMD ["node", "dist/server.js"]