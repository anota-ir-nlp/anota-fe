import { useAuth } from "~/composables/useAuth";
import type { UseFetchOptions } from "nuxt/app";
import type { FetchRequest } from "ofetch";

export const useProtectedFetcher = () => {
  const { getToken, logout } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const toast = useToast();

  const fetcher = $fetch.create({
    baseURL: runtimeConfig.public.apiBaseUrl,
    ignoreResponseError: true,
    async onRequest({ options }) {
      const token = getToken();
      if (!token) {
        toast.add({
          title: "Sesi berakhir",
          description: "Silakan login kembali",
          color: "error",
        });
        await navigateTo("/login");
        return;
      }
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        toast.add({
          title: "Sesi berakhir",
          description: "Token tidak valid, silakan login kembali",
          color: "error",
        });
        await logout();
        await navigateTo("/login");
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
