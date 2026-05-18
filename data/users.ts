import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  UserResponse,
  UsersListResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserUpdateRequest,
  AvailableRolesResponse,
  ProjectResponse,
  DocumentResponse,
} from "~/types/api";

const BASE = "/users";

export function useUsersApi() {
  const { fetcher } = useProtectedFetcher();

  // --- CORE AUTH & PROFILE ---
  const getCurrentUser = () => fetcher<UserResponse>(`${BASE}/me/`);
  
  const getMyProjects = () =>
    fetcher<{ count: number; next: string | null; previous: string | null; results: ProjectResponse[] }>(`${BASE}/me/projects/`);

  // --- GLOBAL USER MANAGEMENT (SUPERADMIN) ---
  
  const getUsers = (page?: number) => {
    const url = page ? `${BASE}/?page=${page}` : `${BASE}/`;
    return fetcher<UsersListResponse>(url);
  };

  const createUser = (data: UserRegistrationRequest) =>
    fetcher<UserRegistrationResponse>(`${BASE}/create/`, { method: "POST", body: data });

  /**
   * Update data pengguna secara GLOBAL (Superadmin)
   * Digunakan untuk mengedit profil user tanpa peduli mereka di project mana.
   */
  const updateUserGlobally = (userId: string, data: Partial<UserUpdateRequest>) =>
    fetcher(`${BASE}/${userId}/update/`, { method: "PATCH", body: data });

  const deleteUserGlobally = (userId: string) =>
    fetcher<{ message: string }>(`${BASE}/${userId}/delete/`, { method: "DELETE" });

  const resetPasswordGlobally = (userId: string, data: { new_password: string }) =>
  fetcher(`${BASE}/${userId}/reset-password/`, { 
    method: "POST", 
    body: data 
  });


  // --- PROJECT SPECIFIC MANAGEMENT (ADMIN/KEPALA RISET) ---

  const getUsersInProject = (projectId: number, page?: number) =>
    fetcher<UsersListResponse>(
      page ? `${BASE}/projects/${projectId}/users/?page=${page}` : `${BASE}/projects/${projectId}/users/`
    );

  /**
   * Partial Update dalam konteks PROJECT tertentu.
   * Tetap dipertahankan jika Fiona butuh update yang spesifik ke relasi project.
   */
  const partialUpdateUserInProject = (projectId: number, userId: string, data: Partial<UserUpdateRequest>) =>
    fetcher(`${BASE}/projects/${projectId}/users/${userId}/update/`, {
      method: "PATCH",
      body: data,
    });

  const manageUserRoleInProject = (projectId: number, data: { user_id: string; role: string; action: "add" | "remove" }) =>
    fetcher(`${BASE}/projects/${projectId}/role-management/`, { method: "POST", body: data });

  // --- PASSWORD & SECURITY ---

  const requestPasswordReset = (data: { email: string }) =>
    fetcher(`${BASE}/password-reset/request/`, { method: "POST", body: data });

  const verifyPasswordReset = (data: {
    email: string;
    otp_code: string;
    new_password: string;
  }) =>
    fetcher(`${BASE}/password-reset/verify/`, { method: "POST", body: data });

  const getAvailableRoles = () =>
    fetcher<AvailableRolesResponse>(`${BASE}/available-roles/`);

  // --- DOCUMENTS ---

  const getMyAssignedDocuments = (page?: number) => {
    let url = `${BASE}/me/assigned-documents/`;
    if (page) url += `?page=${page}`;
    return fetcher<{ count: number; results: DocumentResponse[] }>(url);
  };

  return {
    // Global (Superadmin)
    getUsers,
    createUser,
    updateUserGlobally,
    deleteUserGlobally,
    resetPasswordGlobally,
    
    // Project Based
    getUsersInProject,
    partialUpdateUserInProject,
    manageUserRoleInProject,
    
    // Auth & Utils
    getCurrentUser,
    getMyProjects,
    getAvailableRoles,
    getMyAssignedDocuments,
    requestPasswordReset,
    verifyPasswordReset,
  };
};