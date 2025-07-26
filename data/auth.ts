import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  LoginRequest,
  LoginResponse,
  TokenRefreshResponse,
  UserResponse,
} from "~/types/api";

export function useAuthApi() {
  const { fetcher } = useProtectedFetcher();
  const runtimeConfig = useRuntimeConfig();

  const login = (data: LoginRequest) =>
    $fetch<LoginResponse>(`${runtimeConfig.public.apiBaseUrl}/login/`, {
      method: "POST",
      body: data,
    });

  const refreshToken = (refresh: string) =>
    $fetch<TokenRefreshResponse>(`${runtimeConfig.public.apiBaseUrl}/token/refresh/`, {
      method: "POST",
      body: { refresh },
    });

  const me = () => fetcher<UserResponse>("/users/me/");

  return {
    login,
    refreshToken,
    me,
  };
}
