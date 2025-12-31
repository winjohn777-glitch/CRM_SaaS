import type {
  CRMModuleDefinition,
  ModuleContext,
  ModuleRoute,
  ModuleNavItem,
  ModulePermission,
  ModuleSettingDefinition,
} from '@crm/types';

/**
 * Base class for CRM modules
 * Provides common functionality and structure for all modules
 */
export abstract class BaseModule implements CRMModuleDefinition {
  abstract key: string;
  abstract name: string;
  abstract description: string;
  abstract version: string;
  abstract routeBase: string;
  abstract routes: ModuleRoute[];

  author?: string;

  naicsRequirements?: {
    sectors?: string[];
    industries?: string[];
    templates?: string[];
  };

  requires?: string[];
  conflicts?: string[];

  navigation?: {
    mainNav?: ModuleNavItem;
    settingsNav?: ModuleNavItem;
    entityTabs?: { entityType: any; label: string; path: string; order?: number }[];
  };

  permissions?: ModulePermission[];
  settings?: ModuleSettingDefinition[];

  /**
   * Called when the module is activated for a tenant
   */
  async onActivate(context: ModuleContext): Promise<void> {
    // Override in subclass
  }

  /**
   * Called when the module is deactivated for a tenant
   */
  async onDeactivate(context: ModuleContext): Promise<void> {
    // Override in subclass
  }

  /**
   * Validate that this module can be activated for the given context
   */
  canActivate(context: ModuleContext): { valid: boolean; reason?: string } {
    // Check NAICS requirements
    if (this.naicsRequirements) {
      // This would check against tenant's NAICS code
      // For now, just return valid
    }

    return { valid: true };
  }

  /**
   * Get default configuration for this module
   */
  getDefaultConfig(): Record<string, unknown> {
    const config: Record<string, unknown> = {};
    if (this.settings) {
      for (const setting of this.settings) {
        if (setting.defaultValue !== undefined) {
          config[setting.key] = setting.defaultValue;
        }
      }
    }
    return config;
  }

  /**
   * Get all permissions for this module
   */
  getPermissions(): ModulePermission[] {
    return this.permissions || [];
  }

  /**
   * Check if user has permission for an action
   */
  hasPermission(context: ModuleContext, permissionKey: string): boolean {
    return context.permissions.includes(permissionKey);
  }

  /**
   * Get API routes for this module
   */
  getRoutes(): ModuleRoute[] {
    return this.routes;
  }

  /**
   * Get navigation items for this module
   */
  getNavigation(): ModuleNavItem | undefined {
    return this.navigation?.mainNav;
  }
}
