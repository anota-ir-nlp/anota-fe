# Generic Dockerfile for Nuxt SSR (works for projects with "build" and "start" scripts)
FROM node:18-alpine

WORKDIR /app

# copy package manifests first for caching
COPY package*.json ./

# install deps
RUN npm install

# copy app files
COPY . .

# build (assumes `npm run build` exists)
RUN npm run build

# expose port
EXPOSE 3000

# ensure Nuxt listens on all interfaces
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# start (assumes `npm run start` exists)
CMD ["npm", "run", "start"]