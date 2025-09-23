# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package manifests and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the Nuxt application
RUN pnpm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy package manifests (optional, for debugging)
COPY package.json pnpm-lock.yaml* ./

# Copy built output
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]