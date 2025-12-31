import type {
  CRMModuleDefinition,
  ModuleContext,
  ModuleRegistryEntry,
  ModuleActivationResult,
  ModuleEvent,
} from '@crm/types';

/**
 * Module Registry
 * Manages registration and activation of CRM modules
 */
export class ModuleRegistry {
  private modules: Map<string, ModuleRegistryEntry> = new Map();
  private activatedModules: Map<string, Set<string>> = new Map(); // tenantId -> Set<moduleKey>
  private eventListeners: Map<string, ((event: ModuleEvent) => void)[]> = new Map();

  /**
   * Register a module with the registry
   */
  register(module: CRMModuleDefinition): void {
    if (this.modules.has(module.key)) {
      throw new Error(`Module ${module.key} is already registered`);
    }

    this.modules.set(module.key, {
      definition: module,
      isActive: true,
      loadedAt: new Date(),
    });
  }

  /**
   * Unregister a module
   */
  unregister(moduleKey: string): void {
    this.modules.delete(moduleKey);
  }

  /**
   * Get a module by key
   */
  getModule(key: string): CRMModuleDefinition | undefined {
    return this.modules.get(key)?.definition;
  }

  /**
   * Get all registered modules
   */
  getAllModules(): CRMModuleDefinition[] {
    return Array.from(this.modules.values()).map((entry) => entry.definition);
  }

  /**
   * Get modules that match NAICS requirements
   */
  getModulesForNAICS(naicsCode: string): CRMModuleDefinition[] {
    const sector = naicsCode.substring(0, 2);

    return this.getAllModules().filter((module) => {
      if (!module.naicsRequirements) {
        return true; // Available to all if no requirements
      }

      const { sectors, industries } = module.naicsRequirements;

      // Check sector match
      if (sectors && sectors.length > 0) {
        if (!sectors.includes(sector)) {
          return false;
        }
      }

      // Check industry match
      if (industries && industries.length > 0) {
        if (!industries.some((ind) => naicsCode.startsWith(ind))) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get modules for a template
   */
  getModulesForTemplate(template: string): CRMModuleDefinition[] {
    return this.getAllModules().filter((module) => {
      if (!module.naicsRequirements?.templates) {
        return true;
      }
      return module.naicsRequirements.templates.includes(template);
    });
  }

  /**
   * Activate modules for a tenant
   */
  async activateForTenant(
    tenantId: string,
    moduleKeys: string[],
    context: ModuleContext
  ): Promise<ModuleActivationResult[]> {
    const results: ModuleActivationResult[] = [];

    // Initialize tenant's activated modules set
    if (!this.activatedModules.has(tenantId)) {
      this.activatedModules.set(tenantId, new Set());
    }

    const tenantModules = this.activatedModules.get(tenantId)!;

    for (const moduleKey of moduleKeys) {
      const entry = this.modules.get(moduleKey);

      if (!entry) {
        results.push({
          success: false,
          moduleKey,
          message: `Module ${moduleKey} not found`,
        });
        continue;
      }

      // Check dependencies
      if (entry.definition.requires) {
        const missingDeps = entry.definition.requires.filter(
          (dep) => !tenantModules.has(dep) && !moduleKeys.includes(dep)
        );

        if (missingDeps.length > 0) {
          results.push({
            success: false,
            moduleKey,
            message: `Missing dependencies: ${missingDeps.join(', ')}`,
            errors: missingDeps.map((dep) => `Required module ${dep} is not activated`),
          });
          continue;
        }
      }

      // Check conflicts
      if (entry.definition.conflicts) {
        const conflicts = entry.definition.conflicts.filter((c) => tenantModules.has(c));

        if (conflicts.length > 0) {
          results.push({
            success: false,
            moduleKey,
            message: `Conflicts with: ${conflicts.join(', ')}`,
            errors: conflicts.map((c) => `Conflicts with activated module ${c}`),
          });
          continue;
        }
      }

      try {
        // Call module's onActivate
        if ('onActivate' in entry.definition && typeof entry.definition.onActivate === 'function') {
          await (entry.definition as any).onActivate(context);
        }

        tenantModules.add(moduleKey);

        // Emit event
        this.emitEvent({
          type: 'module:activated',
          moduleKey,
          tenantId,
          userId: context.userId,
          data: {},
          timestamp: new Date(),
        });

        results.push({
          success: true,
          moduleKey,
          message: `Module ${moduleKey} activated successfully`,
        });
      } catch (error) {
        results.push({
          success: false,
          moduleKey,
          message: `Failed to activate module ${moduleKey}`,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        });
      }
    }

    return results;
  }

  /**
   * Deactivate a module for a tenant
   */
  async deactivateForTenant(
    tenantId: string,
    moduleKey: string,
    context: ModuleContext
  ): Promise<ModuleActivationResult> {
    const tenantModules = this.activatedModules.get(tenantId);

    if (!tenantModules || !tenantModules.has(moduleKey)) {
      return {
        success: false,
        moduleKey,
        message: `Module ${moduleKey} is not activated for this tenant`,
      };
    }

    const entry = this.modules.get(moduleKey);
    if (!entry) {
      return {
        success: false,
        moduleKey,
        message: `Module ${moduleKey} not found`,
      };
    }

    // Check if other modules depend on this one
    const dependents = this.getAllModules().filter(
      (m) => m.requires?.includes(moduleKey) && tenantModules.has(m.key)
    );

    if (dependents.length > 0) {
      return {
        success: false,
        moduleKey,
        message: `Cannot deactivate: other modules depend on this`,
        errors: dependents.map((d) => `Module ${d.key} depends on ${moduleKey}`),
      };
    }

    try {
      // Call module's onDeactivate
      if ('onDeactivate' in entry.definition && typeof entry.definition.onDeactivate === 'function') {
        await (entry.definition as any).onDeactivate(context);
      }

      tenantModules.delete(moduleKey);

      // Emit event
      this.emitEvent({
        type: 'module:deactivated',
        moduleKey,
        tenantId,
        userId: context.userId,
        data: {},
        timestamp: new Date(),
      });

      return {
        success: true,
        moduleKey,
        message: `Module ${moduleKey} deactivated successfully`,
      };
    } catch (error) {
      return {
        success: false,
        moduleKey,
        message: `Failed to deactivate module ${moduleKey}`,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get activated modules for a tenant
   */
  getActivatedModules(tenantId: string): string[] {
    return Array.from(this.activatedModules.get(tenantId) || []);
  }

  /**
   * Check if a module is activated for a tenant
   */
  isModuleActivated(tenantId: string, moduleKey: string): boolean {
    return this.activatedModules.get(tenantId)?.has(moduleKey) || false;
  }

  /**
   * Add event listener
   */
  on(eventType: string, listener: (event: ModuleEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  /**
   * Remove event listener
   */
  off(eventType: string, listener: (event: ModuleEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event
   */
  private emitEvent(event: ModuleEvent): void {
    const listeners = this.eventListeners.get(event.type) || [];
    for (const listener of listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in module event listener:`, error);
      }
    }
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistry();
