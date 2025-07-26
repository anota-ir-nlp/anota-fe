import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  DocumentResponse,
  DocumentRequest,
} from "~/types/api";

const BASE = "/document";

export function useDocumentsApi() {
  const { fetcher } = useProtectedFetcher();

  const getDocuments = () => fetcher<{ results: DocumentResponse[] }>(BASE).then(res => res.results);
  const getDocument = (id: number) => fetcher<DocumentResponse>(`${BASE}/${id}`);
  const createDocument = (data: DocumentRequest) =>
    fetcher<DocumentResponse>(BASE, { method: "POST", body: data });
  const updateDocument = (id: number, data: Partial<DocumentRequest>) =>
    fetcher<DocumentResponse>(`${BASE}/${id}`, { method: "PATCH", body: data });
  const deleteDocument = (id: number) =>
    fetcher(`${BASE}/${id}`, { method: "DELETE" });

  return {
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}
