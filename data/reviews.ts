import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { ReviewRequest, ReviewResponse } from "~/types/api";

const BASE = "/annotations/reviews";

export function useReviewsApi() {
  const { fetcher } = useProtectedFetcher();

  const getReviews = () => fetcher<ReviewResponse[]>(BASE);
  const getReview = (id: number) => fetcher<ReviewResponse>(`${BASE}/${id}`);
  const createReview = (data: ReviewRequest) =>
    fetcher<ReviewResponse>(BASE, { method: "POST", body: data });
  const updateReview = (id: number, data: ReviewRequest) =>
    fetcher<ReviewResponse>(`${BASE}/${id}`, { method: "PUT", body: data });
  const partialUpdateReview = (id: number, data: Partial<ReviewRequest>) =>
    fetcher<ReviewResponse>(`${BASE}/${id}`, { method: "PATCH", body: data });
  const deleteReview = (id: number) =>
    fetcher(`${BASE}/${id}`, { method: "DELETE" });
  const reopenReview = (data: { document: number; reason?: string }) =>
    fetcher("/annotations/reviews/reopen/", { method: "POST", body: data });
  const submitReview = (data: { document: number }) =>
    fetcher("/annotations/reviews/submit/", { method: "POST", body: data });
  const adminReopenReview = (data: {
    document: number;
    user_id: string;
    reason?: string;
  }) =>
    fetcher("/annotations/admin/reopen-review/", {
      method: "POST",
      body: data,
    });

  return {
    getReviews,
    getReview,
    createReview,
    updateReview,
    partialUpdateReview,
    deleteReview,
    reopenReview,
    submitReview,
    adminReopenReview,
  };
}
