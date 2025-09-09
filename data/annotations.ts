import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { AnnotationRequest, AnnotationResponse } from "~/types/api";

const BASE = "/annotations";

export function useAnnotationsApi() {
  const { fetcher } = useProtectedFetcher();

  const getAnnotations = () => fetcher<AnnotationResponse[]>(BASE);
  const getAnnotation = (id: number) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}`);
  const createAnnotation = (data: AnnotationRequest) =>
    fetcher<AnnotationResponse>(BASE, { method: "POST", body: data });
  const updateAnnotation = (id: number, data: Partial<AnnotationRequest>) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}`, { method: "PUT", body: data });
  const partialUpdateAnnotation = (
    id: number,
    data: Partial<AnnotationRequest>
  ) =>
    fetcher<AnnotationResponse>(`${BASE}/${id}`, {
      method: "PATCH",
      body: data,
    });
  const deleteAnnotation = (id: number) =>
    fetcher(`${BASE}/${id}`, { method: "DELETE" });
  const reopenAnnotation = (data: { document: number; reason?: string }) =>
    fetcher("/annotations/reopen/", { method: "POST", body: data });
  const submitAnnotation = (data: { document: number }) =>
    fetcher("/annotations/submit/", { method: "POST", body: data });

  return {
    getAnnotations,
    getAnnotation,
    createAnnotation,
    updateAnnotation,
    partialUpdateAnnotation,
    deleteAnnotation,
    reopenAnnotation,
    submitAnnotation,
  };
}
