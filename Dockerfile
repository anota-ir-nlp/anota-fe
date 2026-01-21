# Stage 1: Build the application
FROM node:18-alpine AS builder

ARG AUTH_ORIGIN=http://localhost:3000
ARG AUTH_SECRET=your-secret-key-here
ARG NUXT_PUBLIC_API_BASE_URL=/api/proxy
ARG NUXT_BACKEND_URL=https://anota.cs.ui.ac.id/server/api/v1/
ENV AUTH_ORIGIN=$AUTH_ORIGIN
ENV AUTH_SECRET=$AUTH_SECRET
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_BACKEND_URL=$NUXT_BACKEND_URL

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

ARG AUTH_ORIGIN=http://localhost:3000
ARG AUTH_SECRET=your-secret-key-here
ARG NUXT_PUBLIC_API_BASE_URL=/api/proxy
ARG NUXT_BACKEND_URL=https://anota.cs.ui.ac.id/server/api/v1/
ENV NODE_ENV=production
ENV AUTH_ORIGIN=$AUTH_ORIGIN
ENV AUTH_SECRET=$AUTH_SECRET
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_BACKEND_URL=$NUXT_BACKEND_URL

WORKDIR /app

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy package manifests (optional, for debugging)
COPY package.json pnpm-lock.yaml* ./

# Copy built output
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["npm", "run", "start"]
