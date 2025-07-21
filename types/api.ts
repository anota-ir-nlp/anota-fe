export interface ErrorResponse {
  error: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  active_role: string;
}

export interface UsersListResponse extends UserResponse {}

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
  assignee_id: string;
  document_id: string;
}

export interface DocumentResponse {
  id: string;
  title: string;
  created_at: string;
  sentences: SentenceResponse[];
}
export interface CreateDocumentRequest {
  title: string;
  text: string;
}
export interface SentenceResponse {
  id: string;
  text: string;
  corrected_text?: string;
  has_error?: boolean;
  m2_correction?: string;
}

export interface UpdateSentenceRequest {
  corrected_text?: string;
  has_error?: boolean;
  m2_correction?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: UserResponse;
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
