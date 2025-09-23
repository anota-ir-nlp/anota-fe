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

# Copy package manifests
COPY package.json pnpm-lock.yaml* ./

# Install only prod dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built output from builder
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]