import { useAuth } from "~/data/auth";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchRequest } from "ofetch";
import { toast } from "vue-sonner";


export const useProtectedFetcher = () => {
  const { getAccessToken, refreshAccessToken, logout } = useAuth();
  const runtimeConfig = useRuntimeConfig();

  const fetcher = $fetch.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
    ignoreResponseError: true,
    async onRequest({ options }) {
      let token = getAccessToken();

      if (!token) {
        // Try to refresh token
        token = await refreshAccessToken();
        if (!token) {
          toast.message("Sesi berakhir", {
            description: "Silakan login kembali",
          });
          return;
        }
      }

      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    },
    async onResponseError({ response, request, options }): Promise<any> {
      if (response.status === 401) {
        // Try to refresh token once
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the request with new token
          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${newToken}`);
          options.headers = headers;

          try {
            return await fetcher(request);
          } catch {
            toast.error("Sesi berakhir. Token tidak valid, silakan login kembali");
            await logout();
            await navigateTo("/login");
          }
        } else {
          toast.error("Sesi berakhir. Token tidak valid, silakan login kembali");
          await logout();
          await navigateTo("/login");
        }
      }
    },
  });

  return { fetcher };
};

export const useProtectedFetch = <T>(
  request: FetchRequest,
  options: UseFetchOptions<T> = {}
) => {
  const { fetcher } = useProtectedFetcher();
  return useFetch(request, {
    ...options,
    $fetch: fetcher,
  });
};
