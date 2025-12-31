// Industry Configuration Types

import type {
  IndustryTemplate,
  PipelineType,
  CustomFieldType,
  CRMEntityType,
  ActivityCategory,
  DocumentTemplateType,
  IntegrationType,
} from './enums';

// NAICS Hierarchy
export interface NAICSCode {
  code: string;
  title: string;
  description?: string;
  level: 'sector' | 'subsector' | 'industry-group' | 'naics-industry' | 'national-industry';
  parentCode?: string;
}

// Industry Configuration
export interface IndustryConfiguration {
  id: string;
  naicsCode?: string | null;
  name: string;
  description?: string | null;
  version: string;
  extendsTemplate?: IndustryTemplate | null;
  isActive: boolean;
  priority: number;
  pipelines: PipelineConfiguration[];
  customFields: CustomFieldConfiguration[];
  activityTypes: ActivityTypeConfiguration[];
  documentTemplates: DocumentTemplateConfiguration[];
  integrations: IntegrationConfiguration[];
  modules: IndustryModuleConfiguration[];
}

// Pipeline Configuration
export interface PipelineConfiguration {
  id?: string;
  name: string;
  description?: string | null;
  pipelineType: PipelineType;
  isDefault: boolean;
  stages: PipelineStageConfiguration[];
}

export interface PipelineStageConfiguration {
  id?: string;
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

// Custom Field Configuration
export interface CustomFieldConfiguration {
  id?: string;
  fieldKey: string;
  label: string;
  description?: string | null;
  fieldType: CustomFieldType;
  entityType: CRMEntityType;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  defaultValue?: string | null;
  placeholder?: string | null;
  helpText?: string | null;
  validation?: FieldValidation | null;
  sortOrder: number;
  groupName?: string | null;
  options?: CustomFieldOptionConfiguration[];
}

export interface CustomFieldOptionConfiguration {
  value: string;
  label: string;
  color?: string | null;
  icon?: string | null;
  sortOrder: number;
  isDefault: boolean;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  required?: boolean;
}

// Activity Type Configuration
export interface ActivityTypeConfiguration {
  id?: string;
  activityKey: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  category: ActivityCategory;
  durationDefault?: number | null;
  isSchedulable: boolean;
  isLoggable: boolean;
  requiresLocation: boolean;
  requiredCustomFields: string[];
}

// Document Template Configuration
export interface DocumentTemplateConfiguration {
  id?: string;
  templateKey: string;
  name: string;
  description?: string | null;
  templateType: DocumentTemplateType;
  templateContent: string;
  templateFormat: string;
  availableVariables: TemplateVariable[];
  category?: string | null;
  isDefault: boolean;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'list';
  source: 'contact' | 'account' | 'opportunity' | 'user' | 'tenant' | 'custom';
}

// Integration Configuration
export interface IntegrationConfiguration {
  id?: string;
  integrationKey: string;
  name: string;
  description?: string | null;
  integrationType: IntegrationType;
  provider?: string | null;
  configSchema: Record<string, unknown>;
  defaultConfig?: Record<string, unknown> | null;
  requiredScopes: string[];
  isOptional: boolean;
  isPremium: boolean;
}

// Module Configuration
export interface IndustryModuleConfiguration {
  id?: string;
  moduleKey: string;
  name: string;
  description?: string | null;
  isEnabled: boolean;
  isRequired: boolean;
  configSchema?: Record<string, unknown> | null;
  defaultConfig?: Record<string, unknown> | null;
  routeBase?: string | null;
}

// Merged Configuration (result of configuration inheritance)
export interface MergedConfiguration {
  tenantId?: string;
  template: IndustryTemplate;
  naicsCode?: string;
  naicsHierarchy: string[];

  pipelines: PipelineConfiguration[];
  customFields: CustomFieldConfiguration[];
  activityTypes: ActivityTypeConfiguration[];
  documentTemplates: DocumentTemplateConfiguration[];
  integrations: IntegrationConfiguration[];
  modules: IndustryModuleConfiguration[];

  settings: Record<string, unknown>;
}

// Template Definition
export interface TemplateDefinition {
  template: IndustryTemplate;
  name: string;
  description: string;
  sectors: string[]; // NAICS sector codes
  focus: string;
  defaultPipelines: PipelineConfiguration[];
  defaultModules: string[];
  defaultFields: CustomFieldConfiguration[];
  defaultActivityTypes: ActivityTypeConfiguration[];
}
