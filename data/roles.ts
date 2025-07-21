import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  RoleResponse,
  RoleNamesResponse,
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  DeleteRoleResponse,
} from "~/types/api";

const BASE = "/roles";

export function useRolesApi() {
  const { fetcher } = useProtectedFetcher();

  const getRoles = () => fetcher<RoleResponse[]>(BASE);
  const getActiveRoles = () => fetcher<RoleResponse[]>(`${BASE}/active`);
  const getRoleNames = () => fetcher<RoleNamesResponse>(`${BASE}/names`);
  const getRole = (id: number) => fetcher<RoleResponse>(`${BASE}/${id}`);
  const createRole = (data: CreateRoleRequest) =>
    fetcher<CreateRoleResponse>(BASE, { method: "POST", body: data });
  const updateRole = (id: number, data: UpdateRoleRequest) =>
    fetcher<UpdateRoleResponse>(`${BASE}/${id}`, {
      method: "PATCH",
      body: data,
    });
  const deleteRole = (id: number) =>
    fetcher<DeleteRoleResponse>(`${BASE}/${id}`, { method: "DELETE" });

  return {
    getRoles,
    getActiveRoles,
    getRoleNames,
    getRole,
    createRole,
    updateRole,
    deleteRole,
  };
}
