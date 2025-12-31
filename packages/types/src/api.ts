// API Request/Response Types

// Common API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  timestamp: string;
  requestId?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
  tenant: TenantResponse;
}

export interface RegisterRequest {
  tenantName: string;
  tenantSlug: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  industryTemplate?: string;
  naicsCode?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User Response
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

// Tenant Response
export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  industryTemplate?: string;
  naicsCode?: string;
  timezone: string;
  currency: string;
  locale: string;
  subscriptionStatus: string;
}

// Contact API Types
export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkedIn?: string;
  twitter?: string;
  accountId?: string;
  source?: string;
  status?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

export interface ContactFilters {
  status?: string;
  accountId?: string;
  search?: string;
}

// Account API Types
export interface CreateAccountRequest {
  name: string;
  website?: string;
  industry?: string;
  employeeCount?: string;
  annualRevenue?: number;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
  accountType?: string;
  parentId?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {}

export interface AccountFilters {
  accountType?: string;
  industry?: string;
  search?: string;
}

// Opportunity API Types
export interface CreateOpportunityRequest {
  name: string;
  description?: string;
  amount?: number;
  probability?: number;
  expectedCloseDate?: string;
  pipelineId: string;
  stageId: string;
  accountId?: string;
  primaryContactId?: string;
  assignedToId?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateOpportunityRequest extends Partial<CreateOpportunityRequest> {
  actualCloseDate?: string;
  status?: string;
  lostReason?: string;
  wonReason?: string;
}

export interface OpportunityFilters {
  pipelineId?: string;
  stageId?: string;
  status?: string;
  assignedToId?: string;
  accountId?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  closeDateFrom?: string;
  closeDateTo?: string;
}

export interface MoveOpportunityRequest {
  stageId: string;
  probability?: number;
}

// Activity API Types
export interface CreateActivityRequest {
  activityTypeKey: string;
  subject: string;
  description?: string;
  scheduledAt?: string;
  dueAt?: string;
  durationMinutes?: number;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  assignedToId?: string;
  priority?: number;
  customFields?: Record<string, unknown>;
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  completedAt?: string;
  status?: string;
}

export interface ActivityFilters {
  activityTypeKey?: string;
  status?: string;
  assignedToId?: string;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Pipeline API Types
export interface CreatePipelineRequest {
  name: string;
  description?: string;
  pipelineType: string;
  isDefault?: boolean;
  stages?: CreateStageRequest[];
}

export interface CreateStageRequest {
  name: string;
  description?: string;
  sortOrder: number;
  color?: string;
  probability?: number;
  isInitial?: boolean;
  isFinal?: boolean;
  isWon?: boolean;
  isLost?: boolean;
  requiredFields?: string[];
}

export interface UpdatePipelineRequest {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateStageRequest extends Partial<CreateStageRequest> {}

// Config API Types
export interface InitializeTenantRequest {
  industryTemplate: string;
  naicsCode?: string;
  features?: string[];
  modules?: string[];
}

export interface PreviewConfigResponse {
  template: string;
  naicsCode?: string;
  pipelines: {
    name: string;
    type: string;
    stages: { name: string; probability: number }[];
  }[];
  customFields: {
    fieldKey: string;
    label: string;
    type: string;
    entityType: string;
  }[];
  modules: {
    key: string;
    name: string;
    description: string;
  }[];
  activityTypes: {
    key: string;
    name: string;
    category: string;
  }[];
}
