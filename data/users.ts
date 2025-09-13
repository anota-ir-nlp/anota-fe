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
  DocumentResponse,
} from "~/types/api";

const BASE = "/users";

export function useUsersApi() {
  const { fetcher } = useProtectedFetcher();

  const getUsers = (page?: number) =>
    fetcher<UsersListResponse>(
      page ? `${BASE}/?page=${page}` : `${BASE}/`
    );
  const getDeletedUsers = (page?: number) =>
    fetcher<UsersListResponse>(
      page ? `${BASE}/deleted/?page=${page}` : `${BASE}/deleted/`
    );
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


  const getUsersInProject = (projectId: number) =>
    fetcher<UserResponse[]>(`/projects/${projectId}/assigned-users/`);

  // New endpoints from API docs
  const getMyAssignedDocuments = (page?: number) => {
    let url = `${BASE}/me/assigned-documents/`;
    if (page) {
      url += `?page=${page}`;
    }
    return fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(url);
  };

  const getUserAssignedDocuments = (userId: string, page?: number) => {
    let url = `${BASE}/${userId}/assigned-documents/`;
    if (page) {
      url += `?page=${page}`;
    }
    return fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(url);
  };

  const adminPasswordReset = (data: {
    user_id: string;
    send_email?: boolean;
  }) =>
    fetcher<{
      message: string;
      user_id: string;
      username: string;
      new_password: string;
      email_status: string;
      email_message: string;
    }>(`${BASE}/admin-password-reset/`, { method: "POST", body: data });

  const requestPasswordReset = (data: { email: string }) =>
    fetcher(`${BASE}/password-reset/request/`, { method: "POST", body: data });

  const verifyPasswordReset = (data: {
    email: string;
    otp_code: string;
    new_password: string;
  }) =>
    fetcher(`${BASE}/password-reset/verify/`, { method: "POST", body: data });

  const getAllUsers = async (): Promise<UserResponse[]> => {
    const allUsers: UserResponse[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await getUsers(page);
        if (response.results && response.results.length > 0) {
          allUsers.push(...response.results);
          hasMore = !!response.next;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching users page ${page}:`, error);
        hasMore = false;
      }
    }

    return allUsers;
  };

  const getAllDeletedUsers = async (): Promise<UserResponse[]> => {
    const allUsers: UserResponse[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await getDeletedUsers(page);
        if (response.results && response.results.length > 0) {
          allUsers.push(...response.results);
          hasMore = !!response.next;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching deleted users page ${page}:`, error);
        hasMore = false;
      }
    }

    return allUsers;
  };

  return {
    getUsers,
    getAllUsers,
    getUsersInProject,
    getDeletedUsers,
    getAllDeletedUsers,
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
    getMyAssignedDocuments,
    getUserAssignedDocuments,
    adminPasswordReset,
    requestPasswordReset,
    verifyPasswordReset,
  };
}
