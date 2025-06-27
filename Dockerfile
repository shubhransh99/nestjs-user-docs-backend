# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Run ----------
FROM node:18-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm install --only=production

# Copy built app from previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env

# Copy any other necessary runtime files
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/config ./config

# Use NodeJS to run compiled output
CMD ["node", "dist/main"]

# Optional healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1
