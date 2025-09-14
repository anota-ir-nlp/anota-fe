# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package manifests and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the Nuxt application
RUN pnpm run build

# Stage 2: Create the production image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the built output from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the port Nuxt will run on
EXPOSE 3000

# The command to run the Nuxt server
CMD ["node", ".output/server/index.mjs"]