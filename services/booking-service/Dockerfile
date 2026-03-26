# 🛡️ SOVEREIGN HARDENED ENGINE (Node.js)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S sovereign && adduser -S sovereign -u 1001 -G sovereign
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
EXPOSE 5003
USER sovereign
CMD ["node", "src/index.js"]
