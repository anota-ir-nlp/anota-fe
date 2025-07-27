import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { AssignDocumentRequest } from "~/types/api";

const BASE = "/assignment";

export function useAssignmentsApi() {
  const { fetcher } = useProtectedFetcher();

  const assignDocument = (data: AssignDocumentRequest) =>
    fetcher(BASE, { method: "POST", body: data });
  const unassignDocument = (data: AssignDocumentRequest) =>
    fetcher(BASE, { method: "DELETE", body: data });

  return {
    assignDocument,
    unassignDocument,
  };
}

