import { useProtectedFetcher } from "~/composables/protected-fetcher";
import type {
  ReviewRequest,
  ReviewResponse,
} from "~/types/api";

const BASE = "/annotation/reviews";

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

  return {
    getReviews,
    getReview,
    createReview,
    updateReview,
    partialUpdateReview,
    deleteReview,
  };
}
