import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ErrorResponse,
} from "~/types/api";

export function useAuthApi() {
  const { fetcher } = useProtectedFetcher();

  const login = (data: LoginRequest) =>
    fetcher<LoginResponse>("/auth/login", { method: "POST", body: data });
  const logout = () => fetcher("/auth/logout", { method: "POST" });
  const me = () => fetcher<AuthMeResponse>("/auth/me");
  const resetPassword = (data: ResetPasswordRequest) =>
    fetcher<ResetPasswordResponse>("/auth/reset-password", {
      method: "POST",
      body: data,
    });

  return {
    login,
    logout,
    me,
    resetPassword,
  };
}
