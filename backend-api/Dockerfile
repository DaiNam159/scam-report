# ======================
# Stage 1: Builder
# ======================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy tsconfig, typeorm config và source code
COPY tsconfig*.json ./
COPY typeorm.config.ts ./
COPY src ./src

# Build NestJS app
RUN npm run build

# ======================
# Stage 2: Runner
# ======================
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

# Expose port (the same as your NestJS app)
EXPOSE 3000

# Start the app
CMD ["node", "dist/src/main"]
