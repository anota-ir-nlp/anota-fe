import { createError, getRequestURL, proxyRequest } from "h3";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = String(config.backendUrl || "").replace(/\/$/, "");

  if (!backendUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Backend URL not configured",
    });
  }

  const url = getRequestURL(event);
  const proxiedPath = url.pathname.replace(/^\/api\/proxy/, "");
  const normalizedPath = proxiedPath.startsWith("/")
    ? proxiedPath
    : `/${proxiedPath}`;
  const target = `${backendUrl}${normalizedPath}${url.search}`;

  const backendHost = "anota.cs.ui.ac.id";

  // Force Host header to satisfy backend ALLOWED_HOSTS checks.
  event.node.req.headers.host = backendHost;

  return proxyRequest(event, target, {
    headers: {
      host: backendHost,
    },
  });
});
