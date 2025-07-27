import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ErrorTypeRequest,
  ErrorTypeResponse,
} from "~/types/api";

const BASE = "/annotation/error-types";

export function useErrorTypesApi() {
  const { fetcher } = useProtectedFetcher();

  const getErrorTypes = () => fetcher<ErrorTypeResponse[]>(BASE);
  const getErrorType = (id: number) => fetcher<ErrorTypeResponse>(`${BASE}/${id}`);
  const createErrorType = (data: ErrorTypeRequest) =>
    fetcher<ErrorTypeResponse>(BASE, { method: "POST", body: data });
  const updateErrorType = (id: number, data: ErrorTypeRequest) =>
    fetcher<ErrorTypeResponse>(`${BASE}/${id}`, { method: "PUT", body: data });
  const partialUpdateErrorType = (id: number, data: Partial<ErrorTypeRequest>) =>
    fetcher<ErrorTypeResponse>(`${BASE}/${id}`, { method: "PATCH", body: data });
  const deleteErrorType = (id: number) =>
    fetcher(`${BASE}/${id}`, { method: "DELETE" });

  return {
    getErrorTypes,
    getErrorType,
    createErrorType,
    updateErrorType,
    partialUpdateErrorType,
    deleteErrorType,
  };
}
