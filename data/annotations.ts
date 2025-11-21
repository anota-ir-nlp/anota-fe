import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { 
  AnnotationRequest, 
  AnnotationResponse, 
  AnnotationsListResponse,
  ReopenAnnotationRequest,
  ReopenResponse,
  SubmitAnnotationRequest,
  SubmitResponse,
  AdminReopenAnnotatorRequest,
  AdminReopenResponse
} from "~/types/api";

const BASE = "/annotations";

export function useAnnotationsApi() {
  const { fetcher } = useProtectedFetcher();

  const getAnnotations = (page?: number) => {
    let url = `${BASE}/`;
    if (page) {
      url += `?page=${page}`;
    }
    return fetcher<AnnotationsListResponse>(url);
  };
  
  const getAnnotation = (id: number) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}/`);
  
  const createAnnotation = (data: AnnotationRequest) =>
    fetcher<AnnotationResponse>(`${BASE}/`, { method: "POST", body: data });
  
  const updateAnnotation = (id: number, data: Partial<AnnotationRequest>) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}/`, { method: "PUT", body: data });
  
  const partialUpdateAnnotation = (
    id: number,
    data: Partial<AnnotationRequest>
  ) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}/`, {
      method: "PATCH",
      body: data,
    });
  
  const deleteAnnotation = (id: number) =>
    fetcher(`${BASE}/${id}/`, { method: "DELETE" });
  
  const reopenAnnotation = (data: ReopenAnnotationRequest) =>
    fetcher<ReopenResponse>(`${BASE}/reopen/`, { method: "POST", body: data });
  
  const submitAnnotation = (data: SubmitAnnotationRequest) =>
    fetcher<SubmitResponse>(`${BASE}/submit/`, { method: "POST", body: data });
  
  const adminReopenAnnotator = (projectId: number, data: AdminReopenAnnotatorRequest) =>
    fetcher<AdminReopenResponse>(`${BASE}/admin/projects/${projectId}/reopen-annotator/`, {
      method: "POST",
      body: data,
    });

  return {
    getAnnotations,
    getAnnotation,
    createAnnotation,
    updateAnnotation,
    partialUpdateAnnotation,
    deleteAnnotation,
    reopenAnnotation,
    submitAnnotation,
    adminReopenAnnotator,
  };
}
