// Entity type definitions for CRM

import type {
  ContactStatus,
  AccountType,
  OpportunityStatus,
  ActivityStatus,
  PipelineType,
  ActivityCategory,
  CustomFieldType,
  CRMEntityType,
  UserRole,
  SubscriptionStatus,
  IndustryTemplate,
} from './enums';

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tenant
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  domain?: string | null;
  logo?: string | null;
  industryTemplate?: IndustryTemplate | null;
  naicsCode?: string | null;
  naicsCodes: string[];
  settings: Record<string, unknown>;
  timezone: string;
  currency: string;
  locale: string;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: Date | null;
}

// User
export interface User extends BaseEntity {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date | null;
}

// CRM Contact
export interface CRMContact extends BaseEntity {
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  title?: string | null;
  department?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  linkedIn?: string | null;
  twitter?: string | null;
  accountId?: string | null;
  ownerId?: string | null;
  source?: string | null;
  status: ContactStatus;
  customFields: Record<string, unknown>;
  createdById?: string | null;
}

// CRM Account
export interface CRMAccount extends BaseEntity {
  tenantId: string;
  name: string;
  website?: string | null;
  industry?: string | null;
  employeeCount?: string | null;
  annualRevenue?: number | null;
  description?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  fax?: string | null;
  accountType: AccountType;
  parentId?: string | null;
  customFields: Record<string, unknown>;
}

// CRM Opportunity
export interface CRMOpportunity extends BaseEntity {
  tenantId: string;
  name: string;
  description?: string | null;
  amount?: number | null;
  probability?: number | null;
  expectedCloseDate?: Date | null;
  actualCloseDate?: Date | null;
  pipelineId: string;
  stageId: string;
  accountId?: string | null;
  primaryContactId?: string | null;
  assignedToId?: string | null;
  status: OpportunityStatus;
  lostReason?: string | null;
  wonReason?: string | null;
  customFields: Record<string, unknown>;
}

// CRM Activity
export interface CRMActivity extends BaseEntity {
  tenantId: string;
  activityTypeKey: string;
  subject: string;
  description?: string | null;
  scheduledAt?: Date | null;
  dueAt?: Date | null;
  completedAt?: Date | null;
  durationMinutes?: number | null;
  locationName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactId?: string | null;
  accountId?: string | null;
  opportunityId?: string | null;
  assignedToId?: string | null;
  createdById?: string | null;
  status: ActivityStatus;
  priority: number;
  customFields: Record<string, unknown>;
}

// CRM Pipeline
export interface CRMPipeline extends BaseEntity {
  tenantId: string;
  name: string;
  description?: string | null;
  pipelineType: PipelineType;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  sourceConfigId?: string | null;
}

// CRM Pipeline Stage
export interface CRMPipelineStage extends BaseEntity {
  pipelineId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  color?: string | null;
  probability?: number | null;
  isInitial: boolean;
  isFinal: boolean;
  isWon: boolean;
  isLost: boolean;
  autoActions?: Record<string, unknown> | null;
  requiredFields: string[];
}

// Feature Toggle
export interface TenantFeature extends BaseEntity {
  tenantId: string;
  featureKey: string;
  enabled: boolean;
  config?: Record<string, unknown> | null;
}

// Module Toggle
export interface TenantModule extends BaseEntity {
  tenantId: string;
  moduleKey: string;
  enabled: boolean;
  config?: Record<string, unknown> | null;
}

// Custom Field Definition
export interface TenantCustomField extends BaseEntity {
  tenantId: string;
  fieldKey: string;
  label: string;
  description?: string | null;
  fieldType: CustomFieldType;
  entityType: CRMEntityType;
  options?: CustomFieldOption[] | null;
  validation?: Record<string, unknown> | null;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  defaultValue?: string | null;
  placeholder?: string | null;
  helpText?: string | null;
  groupName?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CustomFieldOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  isDefault: boolean;
}

// Construction Module Types
export interface Job extends BaseEntity {
  tenantId: string;
  jobNumber: string;
  name: string;
  description?: string | null;
  opportunityId?: string | null;
  accountId?: string | null;
  jobType?: string | null;
  status: string;
  priority: number;
  estimatedStartDate?: Date | null;
  estimatedEndDate?: Date | null;
  actualStartDate?: Date | null;
  actualEndDate?: Date | null;
  siteAddress?: string | null;
  siteCity?: string | null;
  siteState?: string | null;
  sitePostalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  contractAmount?: number | null;
  customFields: Record<string, unknown>;
}

export interface Crew extends BaseEntity {
  tenantId: string;
  name: string;
  description?: string | null;
  leaderId?: string | null;
  crewType?: string | null;
  size: number;
  hourlyRate?: number | null;
  isActive: boolean;
  customFields: Record<string, unknown>;
}

export interface Material extends BaseEntity {
  tenantId: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  unit?: string | null;
  unitCost?: number | null;
  markup?: number | null;
  stockQuantity: number;
  reorderPoint?: number | null;
  supplierId?: string | null;
  supplierSku?: string | null;
  isActive: boolean;
  customFields: Record<string, unknown>;
}
