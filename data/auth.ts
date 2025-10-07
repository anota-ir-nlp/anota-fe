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
  const accessToken = useState<string | null>("access_token", () => null);
  const refreshToken = useState<string | null>("refresh_token", () => null);
  const user = useState<any | null>("auth_user", () => null);

  const runtimeConfig = useRuntimeConfig();

  const accessTokenCookie = useCookie<string | null>(ACCESS_TOKEN_KEY, {
    maxAge: 60 * 60 * 24,
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    default: () => null,
  });
  const refreshTokenCookie = useCookie<string | null>(REFRESH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    default: () => null,
  });

  if (!accessToken.value && accessTokenCookie.value) {
    accessToken.value = accessTokenCookie.value;
  }
  if (!refreshToken.value && refreshTokenCookie.value) {
    refreshToken.value = refreshTokenCookie.value;
  }

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

      const res = await $fetch<TokenRefreshResponse>(
        `${runtimeConfig.public.apiBaseUrl}/token/refresh/`,
        {
          method: "POST",
          body: {
            refresh: refresh,
          },
          credentials: "include",
        }
      );

      setTokens(res.access);
      return res.access;
    } catch (error: any) {
      console.error("Token refresh failed:", error);

      // If refresh token is also expired or invalid, clear everything
      if (
        error?.data?.code === "token_not_valid" ||
        error?.status === 401 ||
        error?.response?.status === 401
      ) {
        setTokens(null, null);
        user.value = null;
      }

      return null;
    }
  }

  async function fetchMe() {
    const { fetcher } = useProtectedFetcher();

    try {
      const res = await fetcher<UserResponse>("/users/me/");
      user.value = res;
      return res;
    } catch (error) {
      user.value = null;
      return null;
    }
  }

  async function login(username: string, password: string) {
    try {
      const res = await $fetch<LoginResponse>(
        `${runtimeConfig.public.apiBaseUrl}/login/`,
        {
          method: "POST",
          body: { username, password },
          credentials: "include",
        }
      );

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

  async function initializeAuth() {
    const token = getAccessToken();
    if (token && !user.value) {
      try {
        await fetchMe();
      } catch (error: any) {
        // If access token is expired, try to refresh
        if (
          error?.status === 401 ||
          error?.response?.status === 401 ||
          error?.data?.code === "token_not_valid"
        ) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              await fetchMe();
            } catch {
              // If still fails after refresh, clear tokens
              setTokens(null, null);
              user.value = null;
            }
          } else {
            setTokens(null, null);
            user.value = null;
          }
        } else {
          setTokens(null, null);
          user.value = null;
        }
      }
    } else if (!token) {
      setTokens(null, null);
      user.value = null;
    }
  }

  async function requestPasswordReset(email: string) {
    try {
      const res = await $fetch(
        `${runtimeConfig.public.apiBaseUrl}/users/password-reset/request/`,
        {
          method: "POST",
          body: { email },
          credentials: "include",
        }
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  async function verifyPasswordReset(
    email: string,
    otp_code: string,
    new_password: string
  ) {
    try {
      const res = await $fetch(
        `${runtimeConfig.public.apiBaseUrl}/users/password-reset/verify/`,
        {
          method: "POST",
          body: { email, otp_code, new_password },
          credentials: "include",
        }
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  const isAuthenticated = computed(() => {
    const token = getAccessToken();
    return !!token && !!user.value;
  });
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
    requestPasswordReset,
    verifyPasswordReset,
  };
}
