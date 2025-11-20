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
  ProjectResponse,
} from "~/types/api";

const BASE = "/users";

export function useUsersApi() {
  const { fetcher } = useProtectedFetcher();

  const getCurrentUser = () => fetcher<UserResponse>(`${BASE}/me/`);
  const getAvailableRoles = () =>
    fetcher<AvailableRolesResponse>(`${BASE}/available-roles/`);

  const getMyProjects = () =>
    fetcher<{ count: number; next: string | null; previous: string | null; results: ProjectResponse[] }>(`${BASE}/me/projects/`);

  const getUsersInProject = (projectId: number, page?: number) =>
    fetcher<UsersListResponse>(
      page ? `${BASE}/projects/${projectId}/users/?page=${page}` : `${BASE}/projects/${projectId}/users/`
    );

  const getAvailableUsersInProject = (projectId: number) =>
    fetcher<{
      project_id: number;
      project_name: string;
      users: Array<{
        id: string;
        username: string;
        full_name: string;
        is_in_project: boolean;
        roles_in_project: string[];
      }>;
    }>(`${BASE}/projects/${projectId}/available-users/`);

  const manageUserRoleInProject = (projectId: number, data: { user_id: string; role: string; action: "add" | "remove" }) =>
    fetcher<{ message: string; user_id: string; username: string; project_id: string; project_name: string; role: string; action: string }>(
      `${BASE}/projects/${projectId}/role-management/`, 
      { method: "POST", body: data }
    );

  const getUserRolesInProject = (userId: string, projectId: number) =>
    fetcher<{ user_id: string; project_id: string; project_name: string; roles: string[] }>(
      `${BASE}/${userId}/projects/${projectId}/roles/`
    );

  const getMyAssignedDocuments = (page?: number) => {
    let url = `${BASE}/me/assigned-documents/`;
    if (page) {
      url += `?page=${page}/`;
    }
    return fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(url);
  };



  const createUserInProject = (projectId: number, data: UserRegistrationRequest & { send_email?: boolean; login_url?: string }) =>
    fetcher<UserRegistrationResponse>(`${BASE}/projects/${projectId}/users/create/`, { method: "POST", body: data });

  const updateUserInProject = (projectId: number, userId: string, data: UserUpdateRequest) =>
    fetcher(`${BASE}/projects/${projectId}/users/${userId}/update/`, { method: "PUT", body: data });

  const partialUpdateUserInProject = (projectId: number, userId: string, data: Partial<UserUpdateRequest>) =>
    fetcher(`${BASE}/projects/${projectId}/users/${userId}/update/`, { method: "PATCH", body: data });

  const deleteUserFromProject = (projectId: number, userId: string) =>
    fetcher<{ message: string; soft_deleted: boolean }>(`${BASE}/projects/${projectId}/users/${userId}/remove/`, { method: "DELETE" });

  const resetPasswordInProject = (projectId: number, userId: string, data: { user_id: string; send_email?: boolean }) =>
    fetcher<{
      message: string;
      user_id: string;
      username: string;
      new_password: string;
      email_status: string;
    }>(`${BASE}/projects/${projectId}/users/${userId}/reset-password/`, { method: "POST", body: data });

  const getUserAssignedDocumentsInProject = (projectId: number, userId: string, page?: number) =>
    fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(page ? `${BASE}/projects/${projectId}/users/${userId}/assigned-documents/?page=${page}` : `${BASE}/projects/${projectId}/users/${userId}/assigned-documents/`);

  const deleteUserGlobally = (userId: string) =>
    fetcher<{ message: string; removed_from_projects: number }>(`${BASE}/${userId}/delete/`, { method: "DELETE" });

  const requestPasswordReset = (data: { email: string }) =>
    fetcher(`${BASE}/password-reset/request/`, { method: "POST", body: data });

  const verifyPasswordReset = (data: {
    email: string;
    otp_code: string;
    new_password: string;
  }) =>
    fetcher(`${BASE}/password-reset/verify/`, { method: "POST", body: data });





  const getAllUsersInProject = async (projectId: number): Promise<UserResponse[]> => {
    const allUsers: UserResponse[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await getUsersInProject(projectId, page);
        if (response.results && response.results.length > 0) {
          allUsers.push(...response.results);
          hasMore = !!response.next;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching users in project ${projectId} page ${page}:`, error);
        hasMore = false;
      }
    }

    return allUsers;
  };

  return {
    getUsersInProject,
    getAvailableUsersInProject,
    getAllUsersInProject,
    getCurrentUser,
    getMyProjects,
    getUserRolesInProject,
    getAvailableRoles,
    manageUserRoleInProject,
    getMyAssignedDocuments,
    createUserInProject,
    updateUserInProject,
    partialUpdateUserInProject,
    deleteUserFromProject,
    resetPasswordInProject,
    getUserAssignedDocumentsInProject,
    deleteUserGlobally,
    requestPasswordReset,
    verifyPasswordReset,
  };
}
