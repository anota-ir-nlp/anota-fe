import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type { 
  ReviewRequest, 
  ReviewResponse, 
  ReviewsListResponse,
  ReopenReviewRequest,
  ReopenResponse,
  SubmitReviewRequest,
  SubmitResponse,
  AdminReopenReviewerRequest,
  AdminReopenResponse
} from "~/types/api";

const BASE = "/annotations/reviews";

export function useReviewsApi() {
  const { fetcher } = useProtectedFetcher();

  const getReviews = (page?: number) => {
    let url = BASE;
    if (page) {
      url += `?page=${page}`;
    }
    return fetcher<ReviewsListResponse>(url);
  };
  
  const getReview = (id: number) => fetcher<ReviewResponse>(`${BASE}/${id}/`);
  
  const createReview = (data: ReviewRequest) =>
    fetcher<ReviewResponse>(BASE + "/", { method: "POST", body: data });
  
  const updateReview = (id: number, data: ReviewRequest) =>
    fetcher<ReviewResponse>(`${BASE}/${id}/`, { method: "PUT", body: data });
  
  const partialUpdateReview = (id: number, data: Partial<ReviewRequest>) =>
    fetcher<ReviewResponse>(`${BASE}/${id}/`, { method: "PATCH", body: data });
  
  const deleteReview = (id: number) =>
    fetcher(`${BASE}/${id}/`, { method: "DELETE" });
  
  const reopenReview = (data: ReopenReviewRequest) =>
    fetcher<ReopenResponse>("/annotations/reviews/reopen/", { method: "POST", body: data });
  
  const submitReview = (data: SubmitReviewRequest) =>
    fetcher<SubmitResponse>("/annotations/reviews/submit/", { method: "POST", body: data });
  
  const adminReopenReview = (data: AdminReopenReviewerRequest) =>
    fetcher<AdminReopenResponse>("/annotations/admin/reopen-review/", {
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
