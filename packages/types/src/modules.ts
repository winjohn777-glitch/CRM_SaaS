// Module System Types

import type { CRMEntityType } from './enums';

// Module Definition
export interface CRMModuleDefinition {
  key: string;
  name: string;
  description: string;
  version: string;
  author?: string;

  // NAICS requirements
  naicsRequirements?: {
    sectors?: string[];       // Required NAICS sectors
    industries?: string[];    // Specific NAICS industry codes
    templates?: string[];     // Required industry templates
  };

  // Dependencies
  requires?: string[];        // Other module keys required
  conflicts?: string[];       // Modules that conflict

  // Routing
  routeBase: string;          // Base route path (e.g., "/jobs")
  routes: ModuleRoute[];

  // Menu/Navigation
  navigation?: {
    mainNav?: ModuleNavItem;
    settingsNav?: ModuleNavItem;
    entityTabs?: EntityTabDefinition[];
  };

  // Database
  migrations?: string[];      // Prisma migration files
  seedData?: () => Promise<void>;

  // Permissions
  permissions?: ModulePermission[];

  // Settings
  settings?: ModuleSettingDefinition[];
}

export interface ModuleRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  handler: string;
  middleware?: string[];
  permissions?: string[];
}

export interface ModuleNavItem {
  label: string;
  icon?: string;
  path: string;
  order?: number;
  children?: ModuleNavItem[];
}

export interface EntityTabDefinition {
  entityType: CRMEntityType;
  label: string;
  path: string;
  order?: number;
}

export interface ModulePermission {
  key: string;
  name: string;
  description: string;
  defaultRoles?: string[];
}

export interface ModuleSettingDefinition {
  key: string;
  label: string;
  description?: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  defaultValue?: unknown;
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
}

// Module Context (passed to module handlers)
export interface ModuleContext {
  tenantId: string;
  userId: string;
  userRole: string;
  moduleConfig: Record<string, unknown>;
  permissions: string[];
}

// Module Registry Entry
export interface ModuleRegistryEntry {
  definition: CRMModuleDefinition;
  isActive: boolean;
  loadedAt: Date;
}

// Module Activation Result
export interface ModuleActivationResult {
  success: boolean;
  moduleKey: string;
  message?: string;
  errors?: string[];
}

// Construction Module Types
export interface JobCostingModule extends CRMModuleDefinition {
  key: 'job_costing';
}

export interface CrewSchedulingModule extends CRMModuleDefinition {
  key: 'crew_scheduling';
}

export interface MaterialTrackingModule extends CRMModuleDefinition {
  key: 'material_tracking';
}

// Module Events
export interface ModuleEvent {
  type: string;
  moduleKey: string;
  tenantId: string;
  userId?: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export type ModuleEventType =
  | 'module:activated'
  | 'module:deactivated'
  | 'module:configured'
  | 'module:error';

// Module API Response
export interface ModuleApiResponse<T = unknown> {
  success: boolean;
  module: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
