import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { AssignAdminRequest, AssignAdminResponse, UnassignAdminRequest, UnassignAdminResponse } from "~/types/api";

export function useProjectAssignmentsApi() {
  const { fetcher } = useProtectedFetcher();

  const assignAdmin = (projectId: number, data: AssignAdminRequest) =>
    fetcher<AssignAdminResponse>(`/projects/${projectId}/assign_admin/`, {
      method: "POST",
      body: data,
    });

  const unassignAdmin = (projectId: number, data: UnassignAdminRequest) =>
    fetcher<UnassignAdminResponse>(`/projects/${projectId}/unassign_admin/`, {
      method: "POST",
      body: data,
    });

  return {
    assignAdmin,
    unassignAdmin,
  };
}
