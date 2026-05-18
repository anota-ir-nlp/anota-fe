import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  DocumentResponse,
  DocumentAssignedDetailResponse,
} from "~/types/api";

const BASE = "/users/me/assigned-documents/";

export function useUserDocumentsApi() {
  const { fetcher } = useProtectedFetcher();

  const getAssignedDocuments = (params?: {
    page?: number;
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.date_from) queryParams.append("date_from", params.date_from);
      if (params.date_to) queryParams.append("date_to", params.date_to);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE}?${queryString}` : BASE;

    return fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(url);
  };

  const getAssignedDocument = (id: number | string) =>
    fetcher<DocumentAssignedDetailResponse>(`/documents/my-assigned/${id}/`);

  return {
    getAssignedDocuments,
    getAssignedDocument,
  };
}