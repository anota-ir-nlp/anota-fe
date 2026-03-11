import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ProjectResponse,
  ProjectsListResponse,
  ProjectRequest,
  AssignAdminRequest,
  AssignAdminResponse,
  UnassignAdminRequest,
  UnassignAdminResponse,
  DocumentResponse,
} from "~/types/api";

const BASE = "/projects";

export function useProjectsApi() {
  const { fetcher } = useProtectedFetcher();

  const getProjects = (page?: number) =>
    fetcher<ProjectsListResponse>(
      page ? `${BASE}?/page=${page}` : `${BASE}/`
    );

  const getProject = (id: number) =>
    fetcher<ProjectResponse>(`${BASE}/${id}/`);

  const createProject = (data: ProjectRequest) =>
    fetcher<ProjectResponse>(`${BASE}/`, { method: "POST", body: data });

  const updateProject = (id: number, data: Partial<ProjectRequest>) =>
    fetcher<ProjectResponse>(`${BASE}/${id}/`, {
      method: "PATCH",
      body: data,
    });

  const deleteProject = (id: number) =>
    fetcher(`${BASE}/${id}/`, { method: "DELETE" });

  const assignAdmin = (projectId: number, data: AssignAdminRequest) =>
    fetcher<AssignAdminResponse>(`${BASE}/${projectId}/assign_admin/`, {
      method: "POST",
      body: data,
    });

  const unassignAdmin = (projectId: number, data: UnassignAdminRequest) =>
    fetcher<UnassignAdminResponse>(`${BASE}/${projectId}/unassign_admin/`, {
      method: "POST",
      body: data,
    });

  const getAssignedUsers = (projectId: number) =>
    fetcher<any[]>(`${BASE}/${projectId}/assigned-users/`);

  const getDocumentsInProject = (projectId: number) =>
    fetcher<DocumentResponse[]>(`${BASE}/${projectId}/documents/`);

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    assignAdmin,
    unassignAdmin,
    getAssignedUsers,
    getDocumentsInProject,
  };
}
