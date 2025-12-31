import type {
  IndustryConfiguration,
  MergedConfiguration,
  PipelineConfiguration,
  CustomFieldConfiguration,
  ActivityTypeConfiguration,
  IndustryModuleConfiguration,
} from '@crm/types';
import { IndustryTemplate } from '@crm/types';
import { NAICSUtils } from './naics';
import { TemplateDefinitions, getTemplateForSector } from './templates';
import { ConfigurationMerger } from './merger';

/**
 * Configuration Registry
 *
 * Manages industry configurations and provides merged configurations
 * for tenants based on their NAICS classification.
 */
export class ConfigurationRegistry {
  private sectorConfigs: Map<string, Partial<IndustryConfiguration>> = new Map();
  private industryConfigs: Map<string, Partial<IndustryConfiguration>> = new Map();

  /**
   * Register a sector configuration (2-digit NAICS)
   */
  registerSectorConfig(sectorCode: string, config: Partial<IndustryConfiguration>): void {
    this.sectorConfigs.set(sectorCode, config);
  }

  /**
   * Register an industry-specific configuration (3-6 digit NAICS)
   */
  registerIndustryConfig(naicsCode: string, config: Partial<IndustryConfiguration>): void {
    this.industryConfigs.set(naicsCode, config);
  }

  /**
   * Get merged configuration for a NAICS code
   */
  getConfiguration(naicsCode: string | null): MergedConfiguration {
    const allConfigs = new Map([...this.sectorConfigs, ...this.industryConfigs]);
    return ConfigurationMerger.buildForNAICS(naicsCode, allConfigs);
  }

  /**
   * Get configuration for a template only (no NAICS-specific overrides)
   */
  getTemplateConfiguration(template: IndustryTemplate): MergedConfiguration {
    const templateDef = TemplateDefinitions[template];

    return {
      template,
      naicsHierarchy: [],
      pipelines: templateDef.defaultPipelines,
      customFields: templateDef.defaultFields,
      activityTypes: templateDef.defaultActivityTypes,
      documentTemplates: [],
      integrations: [],
      modules: templateDef.defaultModules.map((key) => ({
        moduleKey: key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        isEnabled: true,
        isRequired: false,
      })),
      settings: {},
    };
  }

  /**
   * Get NAICS hierarchy for a code
   */
  getNAICSHierarchy(naicsCode: string): string[] {
    return NAICSUtils.getHierarchy(naicsCode);
  }

  /**
   * Get the template for a NAICS sector
   */
  getTemplateForSector(sectorCode: string): IndustryTemplate {
    return getTemplateForSector(sectorCode);
  }

  /**
   * Preview configuration for onboarding
   */
  previewConfiguration(template: IndustryTemplate, naicsCode?: string) {
    return ConfigurationMerger.getPreview(template, naicsCode);
  }

  /**
   * Get all available templates
   */
  getAvailableTemplates(): {
    template: IndustryTemplate;
    name: string;
    description: string;
    sectors: string[];
  }[] {
    return Object.values(TemplateDefinitions).map((def) => ({
      template: def.template,
      name: def.name,
      description: def.description,
      sectors: def.sectors,
    }));
  }

  /**
   * Get all NAICS sectors
   */
  getAllSectors(): { code: string; name: string; template: IndustryTemplate }[] {
    return NAICSUtils.getAllSectorCodes().map((code) => ({
      code,
      name: NAICSUtils.getSectorName(code),
      template: getTemplateForSector(code),
    }));
  }

  /**
   * Validate a NAICS code
   */
  isValidNAICS(naicsCode: string): boolean {
    return NAICSUtils.isValid(naicsCode);
  }

  /**
   * Get sector name from code
   */
  getSectorName(sectorCode: string): string {
    return NAICSUtils.getSectorName(sectorCode);
  }

  /**
   * Get default pipelines for a template
   */
  getDefaultPipelines(template: IndustryTemplate): PipelineConfiguration[] {
    return TemplateDefinitions[template]?.defaultPipelines || [];
  }

  /**
   * Get default custom fields for a template
   */
  getDefaultCustomFields(template: IndustryTemplate): CustomFieldConfiguration[] {
    return TemplateDefinitions[template]?.defaultFields || [];
  }

  /**
   * Get default activity types for a template
   */
  getDefaultActivityTypes(template: IndustryTemplate): ActivityTypeConfiguration[] {
    return TemplateDefinitions[template]?.defaultActivityTypes || [];
  }

  /**
   * Get default modules for a template
   */
  getDefaultModules(template: IndustryTemplate): string[] {
    return TemplateDefinitions[template]?.defaultModules || [];
  }
}

// Singleton instance
export const configurationRegistry = new ConfigurationRegistry();
