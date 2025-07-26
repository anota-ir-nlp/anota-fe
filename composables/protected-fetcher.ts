import { useAuth } from "~/composables/useAuth";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchRequest } from "ofetch";

export const useProtectedFetcher = () => {
  const { getAccessToken, refreshAccessToken, logout } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const toast = useToast();

  const fetcher = $fetch.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
    ignoreResponseError: true,
    async onRequest({ options }) {
      let token = getAccessToken();

      if (!token) {
        // Try to refresh token
        token = await refreshAccessToken();
        if (!token) {
          toast.add({
            title: "Sesi berakhir",
            description: "Silakan login kembali",
            color: "error",
          });
          await navigateTo("/login");
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
            toast.add({
              title: "Sesi berakhir",
              description: "Token tidak valid, silakan login kembali",
              color: "error",
            });
            await logout();
            await navigateTo("/login");
          }
        } else {
          toast.add({
            title: "Sesi berakhir",
            description: "Token tidak valid, silakan login kembali",
            color: "error",
          });
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
