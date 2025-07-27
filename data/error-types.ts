import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ErrorTypeRequest,
  ErrorTypeResponse,
  ErrorTypesListResponse,
} from "~/types/api";

// Correct base path to plural, matches API docs
const BASE = "/annotations/error-types";

export function useErrorTypesApi() {
  const { fetcher } = useProtectedFetcher();

  // Accept page param, return paginated or array response
  const getErrorTypes = (page?: number) => {
    const url = page ? `${BASE}/?page=${page}` : BASE;
    return fetcher<ErrorTypesListResponse | ErrorTypeResponse[]>(url);
  };
  const getErrorType = (id: number) => fetcher<ErrorTypeResponse>(`${BASE}/${id}/`);
  const createErrorType = (data: ErrorTypeRequest) =>
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
