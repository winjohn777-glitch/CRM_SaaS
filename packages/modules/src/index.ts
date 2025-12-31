// CRM Module Framework
export { ModuleRegistry, moduleRegistry } from './registry';
export { BaseModule } from './base';
export type {
  CRMModuleDefinition,
  ModuleContext,
  ModuleRoute,
  ModuleNavItem,
  EntityTabDefinition,
  ModulePermission,
  ModuleSettingDefinition,
  ModuleRegistryEntry,
  ModuleActivationResult,
  ModuleEvent,
  ModuleEventType,
} from '@crm/types';

// Construction modules
export * from './construction';
