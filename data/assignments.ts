import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { AssignmentResponse, AssignDocumentRequest } from "~/types/api";

const BASE = "/assignments";

export function useAssignmentsApi() {
  const { fetcher } = useProtectedFetcher();

  const getAssignments = () => fetcher<AssignmentResponse[]>(BASE);
  const getAssignment = (id: string) =>
    fetcher<AssignmentResponse>(`${BASE}/${id}`);
  const assignDocument = (data: AssignDocumentRequest) =>
    fetcher<AssignmentResponse>(BASE, { method: "POST", body: data });

  return {
    getAssignments,
    getAssignment,
    assignDocument,
  };
}
