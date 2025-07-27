import { useState, useCookie } from "#imports";
import { useRuntimeConfig } from "#imports";
import type {
  LoginResponse,
  TokenRefreshResponse,
  UserResponse,
} from "~/types/api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function useAuth() {
  // Global state
  const accessToken = useState<string | null>("access_token", () => null);
  const refreshToken = useState<string | null>("refresh_token", () => null);
  const user = useState<any | null>("auth_user", () => null);

  const runtimeConfig = useRuntimeConfig();

  // Persist tokens in cookies
  const accessTokenCookie = useCookie<string | null>(ACCESS_TOKEN_KEY, {
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    default: () => null
  });
  const refreshTokenCookie = useCookie<string | null>(REFRESH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    default: () => null
  });

  // Initialize state from cookies on first load
  if (import.meta.client && !accessToken.value && accessTokenCookie.value) {
    accessToken.value = accessTokenCookie.value;
    refreshToken.value = refreshTokenCookie.value;
  }

  // Helper to set tokens
  function setTokens(access: string | null, refresh?: string | null) {
    accessToken.value = access;
    accessTokenCookie.value = access;

    if (refresh !== undefined) {
      refreshToken.value = refresh;
      refreshTokenCookie.value = refresh;
    }
  }

  function getAccessToken(): string | null {
    return accessToken.value || accessTokenCookie.value || null;
  }

  function getRefreshToken(): string | null {
    return refreshToken.value || refreshTokenCookie.value || null;
  }

  async function refreshAccessToken(): Promise<string | null> {
    try {
      const refresh = getRefreshToken();
      if (!refresh) {
        setTokens(null, null);
        user.value = null;
        return null;
      }

      const res = await $fetch<TokenRefreshResponse>(`${runtimeConfig.public.apiBaseUrl}/token/refresh/`, {
        method: "POST",
        body: {
          refresh: refresh
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

      setTokens(res.access, res.refresh);
      await fetchMe();
      return true;
    } catch (err) {
      setTokens(null, null);
      user.value = null;
      throw err;
    }
  }

  async function logout() {
    setTokens(null, null);
    user.value = null;
  }

  // Initialize auth state on client-side
  async function initializeAuth() {
    if (import.meta.client && getAccessToken() && !user.value) {
      await fetchMe();
    }
  }

  const isAuthenticated = computed(() => !!getAccessToken() && !!user.value);
  const userRoles = computed(() => user.value?.roles || []);

  return {
    accessToken,
    user,
    isAuthenticated,
    userRoles,
    login,
    logout,
    fetchMe,
    refreshAccessToken,
    setTokens,
    getAccessToken,
    getRefreshToken,
    initializeAuth,
  };
}

