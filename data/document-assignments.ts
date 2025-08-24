import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { AssignDocumentRequest } from "~/types/api";

const BASE = "/assignments";

export function useAssignmentsApi() {
  const { fetcher } = useProtectedFetcher();

  const assignDocument = (data: AssignDocumentRequest) =>
    fetcher(`${BASE}/`, { method: "POST", body: data });

  const unassignDocument = (data: AssignDocumentRequest) =>
    fetcher(`${BASE}/`, { method: "DELETE", body: data });

  const bulkUnassignDocument = (documentId: number, userIds: string[]) =>
    Promise.all(
      userIds.map(userId =>
        unassignDocument({ document_id: documentId, user_id: userId })
      )
    );

  const bulkAssignDocument = (documentId: number, userIds: string[]) =>
    Promise.all(
      userIds.map(userId =>
        assignDocument({ document_id: documentId, user_id: userId })
      )
    );

  return {
    assignDocument,
    unassignDocument,
    bulkUnassignDocument,
    bulkAssignDocument,
  };
}

