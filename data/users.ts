import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  UserResponse,
  UsersListResponse,
  UserDetailResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserUpdateRequest,
  UserPasswordResetRequest,
  UserRoleManagementRequest,
  AvailableRolesResponse,
  UserRolesResponse,
  ErrorResponse,
} from "~/types/api";

const BASE = "/users";

export function useUsersApi() {
  const { fetcher } = useProtectedFetcher();

  const getUsers = () => fetcher<{ results: UsersListResponse[] }>(BASE).then(res => res.results);
  const getDeletedUsers = () => fetcher<{ results: UsersListResponse[] }>(`${BASE}/deleted`).then(res => res.results);
  const getCurrentUser = () => fetcher<UserResponse>(`${BASE}/me`);
  const createUser = (data: UserRegistrationRequest) =>
    fetcher<UserRegistrationResponse>(`${BASE}/create`, { method: "POST", body: data });
  const updateUser = (id: string, data: UserUpdateRequest) =>
    fetcher(`${BASE}/${id}/update`, { method: "PUT", body: data });
  const partialUpdateUser = (id: string, data: Partial<UserUpdateRequest>) =>
    fetcher(`${BASE}/${id}/update`, { method: "PATCH", body: data });
  const deleteUser = (id: string) =>
    fetcher(`${BASE}/${id}/delete`, { method: "DELETE" });
  
  const getUserRoles = (userId: string) =>
    fetcher<UserRolesResponse>(`${BASE}/${userId}/roles`);
  const getAvailableRoles = () =>
    fetcher<AvailableRolesResponse>(`${BASE}/available-roles`);
  const manageUserRole = (data: UserRoleManagementRequest) =>
    fetcher(`${BASE}/role-management`, { method: "POST", body: data });
  
  const resetPassword = (data: UserPasswordResetRequest) =>
    fetcher(`${BASE}/password-reset`, { method: "POST", body: data });
  const generateBackupKey = (userId: string) =>
    fetcher(`${BASE}/generate-backup-key`, { method: "POST", body: { user_id: userId } });

  return {
    getUsers,
    getDeletedUsers,
    getCurrentUser,
    createUser,
    updateUser,
    partialUpdateUser,
    deleteUser,
    getUserRoles,
    getAvailableRoles,
    manageUserRole,
    resetPassword,
    generateBackupKey,
  };
}

