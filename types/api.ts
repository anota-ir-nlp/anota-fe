export interface ErrorResponse {
  error: string;
}

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
  status: string;
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
  annotation: number;
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
  annotation: number;
  sentence: number;
  start_index: number;
  end_index: number;
  error_type: number;
  correction: string;
  is_required: boolean;
  comments?: string;
  is_submitted: boolean;
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
