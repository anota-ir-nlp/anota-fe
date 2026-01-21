# Anota Frontend

Nuxt 3 SPA for Anota, built with Vite + Tailwind and packaged as a Docker image for deployment on a self-managed VM.

## Environment

Create a `.env` (or set vars in your deployment stack) using `.env.example` as a template. Key values:

- `AUTH_ORIGIN=http://localhost:3000`
- `AUTH_SECRET=your-secret-key-here`
- `NUXT_PUBLIC_API_BASE_URL=/api/proxy`
- `NUXT_BACKEND_URL=https://anota.cs.ui.ac.id/server/api/v1/`
- `HOST=0.0.0.0`, `PORT=3030` (override as needed)

API requests from the client hit `/api/proxy/*` and are forwarded to `NUXT_BACKEND_URL`.

## Local Development

```bash
pnpm install
pnpm dev
```

## Build & Preview

```bash
pnpm build       # create production build
pnpm preview     # serve the build locally
```

## Deployment

The GitHub Action (`.github/workflows/deploy.yml`) builds the Docker image, pushes it to Docker Hub, and pulls it onto the target VM over SSH. Configure the required secrets and environment variables (AUTH_ORIGIN, AUTH_SECRET, NUXT_PUBLIC_API_BASE_URL, NUXT_BACKEND_URL, Docker Hub + VPN/SSH credentials) in your repository settings before running the workflow. The container is started via `docker compose up -d` on the VM.
