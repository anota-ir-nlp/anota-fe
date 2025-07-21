import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  DocumentResponse,
  CreateDocumentRequest,
  SentenceResponse,
  UpdateSentenceRequest,
} from "~/types/api";

const BASE = "/documents";

export function useDocumentsApi() {
  const { fetcher } = useProtectedFetcher();

  const getDocuments = () => fetcher<DocumentResponse[]>(BASE);
  const getDocument = (id: string) =>
    fetcher<DocumentResponse>(`${BASE}/${id}`);
  const createDocument = (data: CreateDocumentRequest) =>
    fetcher<DocumentResponse>(BASE, { method: "POST", body: data });

  const updateSentence = (
    documentId: string,
    sentenceId: string,
    data: UpdateSentenceRequest
  ) =>
    fetcher<SentenceResponse>(`${BASE}/${documentId}/sentences/${sentenceId}`, {
      method: "PUT",
      body: data,
    });

  return {
    getDocuments,
    getDocument,
    createDocument,
    updateSentence,
  };
}
