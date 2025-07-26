import { useState } from "#imports";
import { useRuntimeConfig } from "#imports";
import type {
  LoginRequest,
  LoginResponse,
  TokenRefreshResponse,
  UserResponse,
} from "~/types/api";

export function useAuth() {
  // Global state
  const accessToken = useState<string | null>("access_token", () => null);
  const refreshToken = useState<string | null>("refresh_token", () => null);
  const user = useState<any | null>("auth_user", () => null);

  const runtimeConfig = useRuntimeConfig();

  // Helper to set tokens
  function setTokens(access: string | null, refresh?: string | null) {
    accessToken.value = access;
    if (refresh !== undefined) {
      refreshToken.value = refresh;
    }
  }

  function getAccessToken(): string | null {
    return accessToken.value;
  }

  async function refreshAccessToken(): Promise<string | null> {
    try {
      if (!refreshToken.value) {
        setTokens(null, null);
        user.value = null;
        return null;
      }

      const res = await $fetch<TokenRefreshResponse>(`${runtimeConfig.public.apiBaseUrl}/token/refresh/`, {
        method: "POST",
        body: {
          refresh: refreshToken.value
        },
        credentials: 'include',
      });

      setTokens(res.access);
      return res.access;
    } catch {
      setTokens(null, null);
      user.value = null;
      return null;
    }
  }

  async function fetchMe() {
    const { fetcher } = useProtectedFetcher();
    
    try {
      const res = await fetcher<UserResponse>('/users/me/');
      user.value = res;
      return res;
    } catch (error) {
      user.value = null;
      return null;
    }
  }

  async function login(username: string, password: string) {
    try {
      const res = await $fetch<LoginResponse>(`${runtimeConfig.public.apiBaseUrl}/login/`, {
        method: "POST",
        body: { username, password },
        credentials: 'include',
      });

      setTokens(res.access);
      await fetchMe();
      return true;
    } catch (err) {
      setTokens(null);
      user.value = null;
      throw err;
    }
  }

  async function logout() {
    try {
      await $fetch(`${runtimeConfig.public.apiBaseUrl}/logout/`, {
        method: "POST",
        credentials: 'include',
      });
    } catch {
      // Ignore logout errors
    }
    setTokens(null);
    user.value = null;
  }

  // Computed properties
  const isAuthenticated = computed(() => !!getAccessToken() && !!user.value);
  const availableRoles = computed(() => user.value?.roles || []);
  const activeRole = computed(() => user.value?.active_role || availableRoles.value[0] || null);

  return {
    accessToken,
    user,
    isAuthenticated,
    availableRoles,
    activeRole,
    login,
    logout,
    fetchMe,
    refreshAccessToken,
    setTokens,
    getAccessToken,
  };
}
