import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ReviewRequest,
  ReviewResponse,
  ReviewsListResponse,
  ReopenReviewRequest,
  ReopenResponse,
  SubmitReviewRequest,
  SubmitResponse,

} from "~/types/api";

const BASE = "/annotations/reviews";

export function useReviewsApi() {
  const { fetcher } = useProtectedFetcher();

  const getReviews = (page?: number) => {
    let url = `${BASE}/`;
    if (page) {
      url += `?page=${page}`;
    }
    return fetcher<ReviewsListResponse>(url);
  };

  const getReview = (id: number) => fetcher<ReviewResponse>(`${BASE}/${id}/`);

  const createReview = (data: ReviewRequest) =>
    fetcher<ReviewResponse>(`${BASE}/`, { method: "POST", body: data });

  const updateReview = (id: number, data: ReviewRequest) =>
    fetcher<ReviewResponse>(`${BASE}/${id}/`, { method: "PUT", body: data });

  const partialUpdateReview = (id: number, data: Partial<ReviewRequest>) =>
    fetcher<ReviewResponse>(`${BASE}/${id}/`, { method: "PATCH", body: data });

  const reopenReview = (data: ReopenReviewRequest) =>
    fetcher<ReopenResponse>(`${BASE}/reopen/`, { method: "POST", body: data });

  const submitReview = (data: SubmitReviewRequest) =>
    fetcher<SubmitResponse>(`${BASE}/submit/`, { method: "POST", body: data });
  const deleteReview = (id: number) =>
    fetcher(`${BASE}/${id}/`, { method: "DELETE" });

  const getReviewQueue = (
    documentId: number | string,
    includeUnannotated?: boolean
  ) => {
    let url = `/documents/my-assigned/${documentId}/review-queue/`;
    if (includeUnannotated !== undefined) {
      url += `?include_unannotated=${includeUnannotated}`;
    }
    return fetcher(url);
  };

  const adminReopenReview = (data: {
    document: number;
    user_id: string;
    reason?: string;
  }) =>
    fetcher(`/annotations/admin/reopen-review/`, {
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
    getReviewQueue,
  };
}
