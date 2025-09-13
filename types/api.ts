export interface ErrorResponse {
  error: string;
}

// Document status type
export type DocumentStatus = 
  | "belum_dianotasi" 
  | "sedang_dianotasi" 
  | "sudah_dianotasi" 
  | "belum_direview" 
  | "sedang_direview" 
  | "sudah_direview";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
  date_joined: string;
}

export interface UsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserResponse[];
}

export interface UserDetailResponse extends UserResponse {
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  roles: string[];
  active_role: string;
}

export interface CreateUserResponse extends UserResponse {
  default_password: string;
  backup_key: string;
  message: string;
  user_id: string;
}

export interface UpdateUserRequest {
  name?: string;
  roles?: string[];
  active_role?: string;
}

export interface AddRoleRequest {
  role: string;
}
export interface RemoveRoleRequest {
  role: string;
}
export interface AddRoleResponse extends UserResponse {
  message: string;
  user_id: string;
}
export interface RemoveRoleResponse extends UserResponse {
  message: string;
  user_id: string;
}

export interface UserRolesResponse {
  active_role: string;
  available_roles: string[];
}

export interface SwitchRoleRequest {
  role_name: string;
}
export interface SwitchRoleResponse {
  token: string;
  user: UserResponse;
}

export interface RoleResponse {
  id: number;
  name: string;
  is_active: boolean;
}
export interface RoleNamesResponse {
  roles: string[];
}
export interface CreateRoleRequest {
  name: string;
}
export interface CreateRoleResponse {
  message: string;
  role: RoleResponse;
}
export interface UpdateRoleRequest {
  name?: string;
  is_active?: boolean;
}
export interface UpdateRoleResponse {
  message: string;
  role: RoleResponse;
}
export interface DeleteRoleResponse {
  message: string;
  role_id: number;
}

export interface AssignmentResponse {
  id: string;
  assignee: UserResponse;
  document: DocumentResponse;
  created_at: string;
}
export interface AssignDocumentRequest {
  document_id: number;
  user_id: string;
}

export interface DocumentResponse {
  id: number;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string[]; // optional, not present in new API but kept for backward compatibility
  sentences?: SentenceResponse[];
  assigned_by: {
    id: string | null;
    username: string;
    full_name: string;
    institusi: string;
  };
  status: DocumentStatus;
  jumlah_sentence: number;
  institusi: string;
  assignment_details: any; // type as needed
  multiple_assignments: boolean;
}
export interface CreateDocumentRequest {
  title: string;
  text: string;
}
export interface SentenceResponse {
  id: number;
  text: string;
  m2_text: string;
  corrected_text: string;
  has_error: boolean;
  created_at: string;
  updated_at: string;
  document: number;
}

export interface UpdateSentenceRequest {
  corrected_text?: string;
  has_error?: boolean;
  m2_correction?: string;
}

export interface AuthMeResponse extends UserResponse {
  permissions: string[];
}

export interface ResetPasswordRequest {
  email: string;
  backup_key: string;
  new_password: string;
}
export interface ResetPasswordResponse {
  message: string;
}

// Add new types from API docs
export interface AnnotationRequest {
  document: number;
  sentence: number;
  start_index: number;
  end_index: number;
  error_type: number;
  correction: string;
  is_required?: boolean;
  comments?: string;
  is_submitted?: boolean;
}

export interface AnnotationResponse {
  id: number;
  annotator: string;
  document: number;
  sentence: number;
  start_index: number;
  end_index: number;
  error_type: number;
  correction: string;
  is_required: boolean;
  comments?: string;
  is_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnotationsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AnnotationResponse[];
}

export interface ErrorTypeRequest {
  error_code: string;
  description: string;
}

export interface ErrorTypeResponse {
  id: number;
  error_code: string;
  description: string;
  project?: number | null;
  project_name?: string | null;
  is_default: boolean;
  created_by?: string | null;
  created_by_username?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ErrorTypesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ErrorTypeResponse[];
}

export interface ReviewRequest {
  document: number;
  annotation: number | null;
  sentence: number;
  start_index: number;
  end_index: number;
  error_type: number;
  correction: string;
  is_required?: boolean;
  comments?: string;
  is_submitted?: boolean;
}

export interface ReviewResponse {
  id: number;
  reviewer: string;
  document: number;
  annotation: number | null;
  sentence: number;
  start_index: number;
  end_index: number;
  error_type: number;
  correction: string;
  is_required: boolean;
  comments?: string;
  is_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReviewResponse[];
}

export interface DocumentRequest {
  title: string;
  text: string;
}

export interface UserRegistrationRequest {
  username: string;
  email?: string;
  full_name?: string;
}

export interface UserRegistrationResponse {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    password: string;
    backup_key: string;
  };
}

export interface UserPasswordResetRequest {
  new_password: string;
  backup_key: string;
}

export interface UserRoleManagementRequest {
  user_id: string;
  role: string;
  action: "add" | "remove";
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  full_name?: string;
}

export interface AvailableRolesResponse {
  roles: string[];
}

export interface ProjectRequest {
  name: string;
  description?: string;
  documents?: number[];
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  documents: number[];
  assigned_admins: string[];
}

export interface ProjectsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProjectResponse[];
}

export interface AssignAdminRequest {
  user_id: string;
}

export interface AssignAdminResponse {
  message: string;
}

export interface UnassignAdminRequest {
  user_id: string;
}

export interface UnassignAdminResponse {
  message: string;
}

export type AvailableRole = "Admin" | "Annotator" | "Reviewer" | "Kepala Riset";

export interface DocumentAssignedDetailResponse {
  id: number;
  sentences: SentenceResponse[];
  assigned_to: string[];
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
  assigned_by: {
    id: string | null;
    username: string;
    full_name: string;
    institusi: string;
  } | null;
}

export interface ReviewQueueAnnotation {
  id: number;
  start_index: number;
  end_index: number;
  error_type: number;
  error_type_code: string;
  correction: string;
  is_required: boolean;
  comments: string | null;
  annotator: string;
}

export interface ReviewQueueSentence {
  sentence_id: number;
  text: string;
  has_submitted_annotations: boolean;
  my_review_exists: boolean;
  annotation_ids: number[];
  annotations: ReviewQueueAnnotation[];
}

export interface ReviewQueueResponse {
  document_id: number;
  total_sentences: number;
  submitted_sentences: number;
  reviewed_sentences: number;
  pending_sentences: number;
  next_sentence_id: number;
  sentences: ReviewQueueSentence[];
}

// Admin reopen functionality
export interface AdminReopenAnnotatorRequest {
  document: number;
  user_id: string;
  reason?: string;
}

export interface AdminReopenReviewerRequest {
  document: number;
  user_id: string;
  reason?: string;
}

export interface AdminReopenResponse {
  message: string;
  status: string;
}

// Submit requests
export interface SubmitAnnotationRequest {
  document: number;
}

export interface SubmitReviewRequest {
  document: number;
}

export interface SubmitResponse {
  message: string;
  status: string;
}

// Reopen requests (for annotators/reviewers themselves)
export interface ReopenAnnotationRequest {
  document: number;
  reason?: string;
}

export interface ReopenReviewRequest {
  document: number;
  reason?: string;
}

export interface ReopenResponse {
  message: string;
  status: string;
}

// Document assignment types
export interface AssignDocumentToUserRequest {
  document_id: number;
  user_id: string;
  notes?: string;
}

export interface UnassignDocumentFromUserRequest {
  document_id: number;
  user_id: string;
}

export interface DocumentAssignmentResponse {
  message: string;
  assignment_record: {
    id: number;
    assigned_user: string;
    assigned_by: string;
    assigned_at: string;
    notes?: string;
    is_active: boolean;
  };
}

export interface DocumentPreviewRequest {
  text: string;
}

export interface DocumentPreviewResponse {
  text: string;
  sentence_count: number;
  sentences: string[];
}
