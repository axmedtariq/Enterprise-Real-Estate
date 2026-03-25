# 🛡️ SOVEREIGN HARDENED GATEWAY
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini && \
    addgroup -g 1001 -S sovereign && \
    adduser -S sovereign -u 1001 -G sovereign
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
USER sovereign
EXPOSE 5000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
