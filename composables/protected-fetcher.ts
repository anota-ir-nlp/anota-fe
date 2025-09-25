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
        // Try to refresh token if no access token
        token = await refreshAccessToken();
        if (!token) {
          throw new Error("No valid token available");
        }
      }

      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    },
    async onResponseError({ response, request, options }) {
      if (response.status === 401) {
        const errorData = response._data;
        
        // Check if it's a token expiration error
        if (errorData?.code === "token_not_valid" || 
            errorData?.detail?.includes("token") ||
            errorData?.messages?.some((msg: any) => msg.message === "Token is expired")) {
          
          console.log("Access token expired, attempting refresh...");
          
          // Try to refresh token
          const newToken = await refreshAccessToken();
          if (newToken) {
            console.log("Token refreshed successfully, retrying request...");
            
            // Retry the request with new token
            const headers = new Headers(options.headers);
            headers.set("Authorization", `Bearer ${newToken}`);
            
            try {
              const retryResponse = await $fetch(request, {
                ...options,
                headers,
                baseURL: runtimeConfig.public.apiBaseUrl,
              });
              return retryResponse;
            } catch (retryError: any) {
              console.error("Retry request failed:", retryError);
              
              // If retry still fails with 401, logout user
              if (retryError?.status === 401 || retryError?.response?.status === 401) {
                toast.error("Sesi berakhir", {
                  description: "Silakan login kembali"
                });
                await logout();
                await navigateTo("/login");
              }
              throw retryError;
            }
          } else {
            console.log("Token refresh failed, redirecting to login");
            toast.error("Sesi berakhir", {
              description: "Silakan login kembali"
            });
            await logout();
            await navigateTo("/login");
          }
        } else {
          // Other 401 errors (not token related)
          toast.error("Akses ditolak", {
            description: "Anda tidak memiliki izin untuk mengakses resource ini"
          });
        }
      }
      
      // For other errors, let them bubble up
      throw response._data || new Error(`HTTP ${response.status}: ${response.statusText}`);
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
