import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  DocumentResponse,
  DocumentAssignedDetailResponse,
} from "~/types/api";

const BASE = "/users/me/assigned-documents/";

export function useUserDocumentsApi() {
  const { fetcher } = useProtectedFetcher();

  // Supports pagination, but default is first page
  const getAssignedDocuments = (page?: number) =>
    fetcher<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DocumentResponse[];
    }>(page ? `${BASE}?page=${page}` : BASE);

  // Fetch a single assigned document by id
  const getAssignedDocument = (id: number | string) =>
    fetcher<DocumentAssignedDetailResponse>(`/documents/my-assigned/${id}/`);

  return {
    getAssignedDocuments,
    getAssignedDocument,
  };
}
