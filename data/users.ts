import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  UserResponse,
  UsersListResponse,
  UserDetailResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  AddRoleRequest,
  RemoveRoleRequest,
  AddRoleResponse,
  RemoveRoleResponse,
  UserRolesResponse,
  SwitchRoleRequest,
  SwitchRoleResponse,
  ErrorResponse,
} from "~/types/api";

const BASE = "/users";

export function useUsersApi() {
  const { fetcher } = useProtectedFetcher();

  const getUsers = () => fetcher<UsersListResponse[]>(BASE);
  const getUser = (id: string) => fetcher<UserDetailResponse>(`${BASE}/${id}`);
  const createUser = (data: CreateUserRequest) =>
    fetcher<CreateUserResponse>(BASE, { method: "POST", body: data });
  const updateUser = (id: string, data: UpdateUserRequest) =>
    fetcher(BASE + "/" + id, { method: "PATCH", body: data });
  const deleteUser = (id: string) =>
    fetcher(BASE + "/" + id, { method: "DELETE" });
  const getUserRoles = (id: string) =>
    fetcher<UserRolesResponse>(`${BASE}/${id}/roles`);
  const switchActiveRole = (id: string, data: SwitchRoleRequest) =>
    fetcher<SwitchRoleResponse>(`${BASE}/${id}/active-role`, {
      method: "PATCH",
      body: data,
    });
  const addRole = (id: string, data: AddRoleRequest) =>
    fetcher<AddRoleResponse>(`${BASE}/${id}/add-role`, {
      method: "POST",
      body: data,
    });
  const removeRole = (id: string, data: RemoveRoleRequest) =>
    fetcher<RemoveRoleResponse>(`${BASE}/${id}/remove-role`, {
      method: "POST",
      body: data,
    });

  // Bulk CSV upload
  const bulkCreateUsers = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetcher<any>(`${BASE}/csv`, {
      method: "POST",
      body: formData,
    });
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserRoles,
    switchActiveRole,
    addRole,
    removeRole,
    bulkCreateUsers,
  };
}
