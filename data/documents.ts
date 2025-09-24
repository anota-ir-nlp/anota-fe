import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  DocumentResponse,
  DocumentRequest,
  DocumentAssignedDetailResponse,
} from "~/types/api";

const BASE = "/documents";

export function useDocumentsApi() {
  const { fetcher } = useProtectedFetcher();

  const getDocuments = (page?: number) =>
    fetcher<{ count: number; next: string | null; previous: string | null; results: DocumentResponse[] }>(
      page ? `${BASE}/?page=${page}` : `${BASE}/`
    );

  const getDocument = (id: number) =>
    fetcher<DocumentResponse>(`${BASE}/${id}/`);

  const createDocument = (data: DocumentRequest) =>
    fetcher<DocumentResponse>(`${BASE}/`, { method: "POST", body: data });

  const updateDocument = (id: number, data: Partial<DocumentRequest>) =>
    fetcher<DocumentResponse>(`${BASE}/${id}/`, {
      method: "PATCH",
      body: data,
    });

  const deleteDocument = (id: number) =>
    fetcher(`${BASE}/${id}`, { method: "DELETE" });

  const getDocumentsInProject = (projectId: number) =>
    fetcher<DocumentResponse[]>(`/projects/${projectId}/documents/`);

  const assignDocumentToUser = (data: {
    document_id: number;
    user_id: string;
    notes?: string;
  }) =>
    fetcher(`${BASE}/assignment/`, {
      method: "POST",
      body: data,
    });

  const unassignDocumentFromUser = (data: {
    document_id: number;
    user_id: string;
  }) =>
    fetcher(`${BASE}/assignment/`, {
      method: "DELETE",
      body: data,
    });

  const getMyAssignedDocument = (id: number) =>
    fetcher<DocumentAssignedDetailResponse>(`${BASE}/my-assigned/${id}/`);

  const previewDocumentSentences = (data: { text: string }) =>
    fetcher<{
      text: string;
      sentence_count: number;
      sentences: string[];
    }>(`${BASE}/preview/`, {
      method: "POST",
      body: data,
    });

  const exportDocument = (id: number, format: "parallel" | "m2") =>
    fetcher<Blob>(`${BASE}/${id}/export/${format}/`, {
      method: "GET",
      responseType: "blob",
    });

  return {
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsInProject,
    assignDocumentToUser,
    unassignDocumentFromUser,
    getMyAssignedDocument,
    previewDocumentSentences,
    exportDocument,
  };
}

