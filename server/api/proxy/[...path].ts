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

  return proxyRequest(event, target);
});
