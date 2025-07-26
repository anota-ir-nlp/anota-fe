import { useState, useCookie } from "#imports";
import { useRuntimeConfig } from "#imports";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function useAuth() {
  // Global state
  const accessToken = useState<string | null>("access_token", () => null);
  const refreshToken = useState<string | null>("refresh_token", () => null);
  const user = useState<any | null>("auth_user", () => null);

  // Persist tokens in cookies
  const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY, {
    maxAge: 60 * 60 * 24, // 24 hours
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  });
  const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    secure: false,
    sameSite: 'lax'
  });

  // Helper to set tokens
  function setTokens(access: string | null, refresh: string | null) {
    accessToken.value = access;
    refreshToken.value = refresh;
    accessTokenCookie.value = access;
    refreshTokenCookie.value = refresh;
  }

  function getAccessToken(): string | null {
    return accessToken.value || accessTokenCookie.value || null;
  }

  function getRefreshToken(): string | null {
    return refreshToken.value || refreshTokenCookie.value || null;
  }

  async function refreshAccessToken(): Promise<string | null> {
    const runtimeConfig = useRuntimeConfig();
    const refresh = getRefreshToken();

    if (!refresh) return null;

    try {
      const res = await $fetch<{ access: string }>(`${runtimeConfig.public.apiBaseUrl}/token/refresh/`, {
        method: "POST",
        body: { refresh },
      });

      setTokens(res.access, refresh);
      return res.access;
    } catch {
      setTokens(null, null);
      user.value = null;
      return null;
    }
  }

  async function fetchMe() {
    const runtimeConfig = useRuntimeConfig();
    let token = getAccessToken();

    if (!token) {
      // Try to refresh token
      token = await refreshAccessToken();
      if (!token) {
        user.value = null;
        return null;
      }
    }

    try {
      const res = await $fetch(`${runtimeConfig.public.apiBaseUrl}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      user.value = res;
      return res;
    } catch (error: any) {
      if (error.status === 401) {
        // Try to refresh token once
        token = await refreshAccessToken();
        if (token) {
          try {
            const res = await $fetch(`${runtimeConfig.public.apiBaseUrl}/users/me/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            user.value = res;
            return res;
          } catch {
            user.value = null;
            setTokens(null, null);
            return null;
          }
        }
      }
      user.value = null;
      setTokens(null, null);
      return null;
    }
  }

  async function login(username: string, password: string) {
    const runtimeConfig = useRuntimeConfig();
    try {
      // Use the proxy URL instead of direct backend URL
      const res = await $fetch<{ access: string; refresh: string }>(`${runtimeConfig.public.apiBaseUrl}/login/`, {
        method: "POST",
        body: { username, password },
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

  // Is authenticated
  const isAuthenticated = computed(() => !!getAccessToken() && !!user.value);

  // Available roles
  const availableRoles = computed(() => user.value?.roles || []);

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    availableRoles,
    login,
    logout,
    fetchMe,
    refreshAccessToken,
    setTokens,
    getAccessToken,
    getRefreshToken,
  };
}
