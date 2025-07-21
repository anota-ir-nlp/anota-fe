import { useState, useCookie } from "#imports";
import { useRuntimeConfig } from "#imports";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  // Global state
  const token = useState<string | null>("auth_token", () => null);
  const user = useState<any | null>("auth_user", () => null);

  // Persist token in localStorage/cookie
  const tokenCookie = useCookie(TOKEN_KEY);

  // Helper to set token
  function setToken(newToken: string | null) {
    token.value = newToken;
    tokenCookie.value = newToken;
    if (process.client) {
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  // Helper to get token (from state, cookie, or localStorage)
  function getToken(): string | null {
    // Only access localStorage on client
    if (process.client) {
      return (
        token.value || tokenCookie.value || localStorage.getItem(TOKEN_KEY)
      );
    }
    // On server, only use state/cookie
    return token.value || tokenCookie.value || null;
  }

  // Fetch current user info
  async function fetchMe() {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
    const authToken = getToken();
    if (!authToken) {
      user.value = null;
      return null;
    }
    try {
      const res = await $fetch(`${apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      user.value = res;
      return res;
    } catch {
      user.value = null;
      setToken(null);
      return null;
    }
  }

  // Login
  async function login(email: string, password: string) {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
    try {
      const res = await $fetch<{ token: string }>(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        body: { email, password },
      });
      setToken(res.token);
      await fetchMe();
      return true;
    } catch (err) {
      setToken(null);
      user.value = null;
      throw err;
    }
  }

  // Logout
  async function logout() {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
    const authToken = getToken();
    try {
      await $fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {}
    setToken(null);
    user.value = null;
  }

  // Switch role (calls API, updates token and user)
  async function switchRole(roleName: string) {
    const runtimeConfig = useRuntimeConfig();
    const apiBaseUrl = runtimeConfig.public.apiBaseUrl;
    const authToken = getToken();
    try {
      const res = await $fetch<{ token: string }>(
        `${apiBaseUrl}/users/${user.value.id}/active-role`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${authToken}` },
          body: { role_name: roleName },
        }
      );
      setToken(res.token);
      await fetchMe();
      return true;
    } catch (err) {
      throw err;
    }
  }

  // Is authenticated
  const isAuthenticated = computed(() => !!getToken() && !!user.value);

  // Available roles
  const availableRoles = computed(() => user.value?.roles || []);

  // Active role
  const activeRole = computed(() => user.value?.active_role || null);

  return {
    token,
    user,
    isAuthenticated,
    availableRoles,
    activeRole,
    login,
    logout,
    fetchMe,
    switchRole,
    setToken,
    getToken,
  };
}
