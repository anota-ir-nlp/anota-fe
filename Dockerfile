# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Nuxt application
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Copy the built output from the builder stage
COPY ./.output ./.output

# Expose the port Nuxt will run on
EXPOSE 3000

# The command to run the Nuxt server
CMD ["npm", "run", "start"]