import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ErrorTypeRequest,
  ErrorTypeResponse,
  ErrorTypesListResponse,
} from "~/types/api";

const BASE = "/annotations/error-types";

export function useErrorTypesApi() {
  const { fetcher } = useProtectedFetcher();

  const getErrorTypes = (page?: number, projectId?: number) => {
    let url = BASE;
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (projectId) params.append("project_id", projectId.toString());

    if (params.toString()) {
      url += `/?${params.toString()}`;
    }

    return fetcher<ErrorTypesListResponse | ErrorTypeResponse[]>(url);
  };
  const getErrorType = (id: number) => fetcher<ErrorTypeResponse>(`${BASE}/${id}/`);
  const createErrorType = (data: ErrorTypeRequest & { project_id?: number | null | undefined }) =>
    fetcher<ErrorTypeResponse>(BASE, { method: "POST", body: data });
  const updateErrorType = (id: number, data: ErrorTypeRequest) =>
    fetcher<ErrorTypeResponse>(`${BASE}/${id}/`, { method: "PUT", body: data });
  const partialUpdateErrorType = (id: number, data: Partial<ErrorTypeRequest>) =>
    fetcher<ErrorTypeResponse>(`${BASE}/${id}/`, { method: "PATCH", body: data });
  const deleteErrorType = (id: number) =>
    fetcher(`${BASE}/${id}/`, { method: "DELETE" });

  return {
    getErrorTypes,
    getErrorType,
    createErrorType,
    updateErrorType,
    partialUpdateErrorType,
    deleteErrorType,
  };
}
