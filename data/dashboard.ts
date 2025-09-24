import { useProtectedFetcher } from "~/composables/protected-fetcher";

const BASE = "/dashboard";

export interface DashboardSummaryParams {
  project_id?: number;
  document_id?: number;
}

export interface AnnotatorPerformanceParams extends DashboardSummaryParams {
  user_id: string;
}

export interface ReviewerPerformanceParams extends DashboardSummaryParams {
  user_id: string;
}

export interface IAAParams {
  annotator_id: string;
  reviewer_id: string;
  project_id?: number;
  document_id?: number;
}

export interface DashboardSummaryResponse {
  filters: {
    project_id: number | null;
    document_id: number | null;
    role: string;
  };
  totals: {
    annotations: number;
    reviews: number;
  };
  per_annotator: Array<{
    annotator_id: string;
    annotator_name: string;
    annotations: number;
  }>;
  per_reviewer: Array<{
    reviewer_id: string;
    reviewer_name: string;
    reviews: number;
  }>;
  per_document: Array<{
    document_id: number;
    document_title: string;
    annotations: number;
    reviews: number;
  }>;
  inter_annotator_agreement: {
    cohen_kappa_avg: number;
    approx_ratio: number;
    matching_annotation_occurrences: number;
  };
}

export interface AnnotatorPerformanceResponse {
  filters: {
    annotator_id: string;
    project_id: number | null;
    document_id: number | null;
    role: string;
  };
  totals: {
    annotations: number;
  };
  per_document: Array<{
    document_id: number;
    document_title: string;
    annotations: number;
  }>;
  agreement_with_others: {
    cohen_kappa_avg: number;
    approx_ratio: number;
    matching_annotation_count: number;
  };
}

export interface ReviewerPerformanceResponse {
  filters: {
    reviewer_id: string;
    project_id: number | null;
    document_id: number | null;
    role: string;
  };
  totals: {
    reviews: number;
  };
  per_document: Array<{
    document_id: number;
    document_title: string;
    reviews: number;
  }>;
}

export interface IAAResponse {
  filters: {
    annotator_id: string;
    reviewer_id: string;
    project_id: number | null;
    document_id: number | null;
  };
  totals: {
    items: number;
    correct: number;
    accuracy: number;
  };
  confusion_like: {
    agree_no_annotation: number;
    agree_error_type: number;
    disagree_presence: number;
    disagree_error_type: number;
  };
  kappa: number;
}

export function useDashboardApi() {
  const { fetcher } = useProtectedFetcher();

  const getDashboardSummary = (params?: DashboardSummaryParams) => {
    let url = BASE;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.project_id) searchParams.append("project_id", params.project_id.toString());
      if (params.document_id) searchParams.append("document_id", params.document_id.toString());
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}/`;
      }
    }
    return fetcher<DashboardSummaryResponse>(url);
  };

  const getAnnotatorPerformance = (params: AnnotatorPerformanceParams) => {
    let url = `${BASE}/annotators/${params.user_id}`;
    const searchParams = new URLSearchParams();
    if (params.project_id) searchParams.append("project_id", params.project_id.toString());
    if (params.document_id) searchParams.append("document_id", params.document_id.toString());
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}/`;
    }
    return fetcher<AnnotatorPerformanceResponse>(url);
  };

  const getReviewerPerformance = (params: ReviewerPerformanceParams) => {
    let url = `${BASE}/reviewers/${params.user_id}`;
    const searchParams = new URLSearchParams();
    if (params.project_id) searchParams.append("project_id", params.project_id.toString());
    if (params.document_id) searchParams.append("document_id", params.document_id.toString());
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
    return fetcher<ReviewerPerformanceResponse>(url);
  };

  const getInterAnnotatorAgreement = (params: IAAParams) => {
    let url = `${BASE}/iaa`;
    const searchParams = new URLSearchParams();
    searchParams.append("annotator_id", params.annotator_id);
    searchParams.append("reviewer_id", params.reviewer_id);
    if (params.project_id) searchParams.append("project_id", params.project_id.toString());
    if (params.document_id) searchParams.append("document_id", params.document_id.toString());
    url += `?${searchParams.toString()}/`;
    return fetcher<IAAResponse>(url);
  };

  return {
    getDashboardSummary,
    getAnnotatorPerformance,
    getReviewerPerformance,
    getInterAnnotatorAgreement,
  };
}
