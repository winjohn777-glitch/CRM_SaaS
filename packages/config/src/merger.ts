import merge from 'lodash.merge';
import type {
  IndustryConfiguration,
  MergedConfiguration,
  PipelineConfiguration,
  CustomFieldConfiguration,
  ActivityTypeConfiguration,
  DocumentTemplateConfiguration,
  IntegrationConfiguration,
  IndustryModuleConfiguration,
} from '@crm/types';
import { IndustryTemplate } from '@crm/types';
import { NAICSUtils } from './naics';
import { TemplateDefinitions, getTemplateForSector } from './templates';
import type { LoadedConfiguration } from './types';

/**
 * Configuration Merger
 *
 * Merges configurations in this order:
 * 1. Universal (base config for all CRMs)
 * 2. Template (industry group template)
 * 3. Sector (2-digit NAICS)
 * 4. Subsector (3-digit NAICS)
 * 5. Industry (4-6 digit NAICS)
 *
 * Later configurations override earlier ones, with arrays being merged by key.
 */
export class ConfigurationMerger {
  /**
   * Merge multiple configurations in priority order
   */
  static merge(configs: LoadedConfiguration[]): MergedConfiguration {
    // Sort by priority (lower = earlier in chain)
    const sorted = [...configs].sort((a, b) => a.source.priority - b.source.priority);

    // Start with empty configuration
    let result: MergedConfiguration = {
      template: IndustryTemplate.SALES_FOCUSED,
      naicsHierarchy: [],
      pipelines: [],
      customFields: [],
      activityTypes: [],
      documentTemplates: [],
      integrations: [],
      modules: [],
      settings: {},
    };

    for (const { source, config } of sorted) {
      result = this.mergeConfig(result, config, source.type);
    }

    return result;
  }

  /**
   * Build a merged configuration for a specific NAICS code
   */
  static buildForNAICS(
    naicsCode: string | null,
    sectorConfigs: Map<string, Partial<IndustryConfiguration>>
  ): MergedConfiguration {
    const configs: LoadedConfiguration[] = [];

    // 1. Determine template from NAICS sector
    let template = IndustryTemplate.SALES_FOCUSED;
    if (naicsCode) {
      const sector = NAICSUtils.getSector(naicsCode);
      template = getTemplateForSector(sector);
    }

    // 2. Load template configuration
    const templateDef = TemplateDefinitions[template];
    if (templateDef) {
      configs.push({
        source: { type: 'template', priority: 10 },
        config: {
          pipelines: templateDef.defaultPipelines,
          customFields: templateDef.defaultFields,
          activityTypes: templateDef.defaultActivityTypes,
          modules: templateDef.defaultModules.map((key) => ({
            moduleKey: key,
            name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            isEnabled: true,
            isRequired: false,
          })),
        },
      });
    }

    // 3. Load NAICS hierarchy configs
    if (naicsCode) {
      const hierarchy = NAICSUtils.getHierarchy(naicsCode);
      hierarchy.forEach((code, index) => {
        const sectorConfig = sectorConfigs.get(code);
        if (sectorConfig) {
          configs.push({
            source: {
              type: index === 0 ? 'sector' : index === 1 ? 'subsector' : 'industry',
              code,
              priority: 20 + index * 10,
            },
            config: sectorConfig,
          });
        }
      });
    }

    // Merge all configs
    const merged = this.merge(configs);
    merged.template = template;
    merged.naicsCode = naicsCode || undefined;
    merged.naicsHierarchy = naicsCode ? NAICSUtils.getHierarchy(naicsCode) : [];

    return merged;
  }

  /**
   * Merge a single config into the result
   */
  private static mergeConfig(
    result: MergedConfiguration,
    config: Partial<IndustryConfiguration>,
    sourceType: string
  ): MergedConfiguration {
    return {
      ...result,
      template: result.template,
      naicsCode: result.naicsCode,
      naicsHierarchy: result.naicsHierarchy,
      pipelines: this.mergeArrayByKey(result.pipelines, config.pipelines || [], 'name'),
      customFields: this.mergeArrayByKey(result.customFields, config.customFields || [], 'fieldKey'),
      activityTypes: this.mergeArrayByKey(result.activityTypes, config.activityTypes || [], 'activityKey'),
      documentTemplates: this.mergeArrayByKey(result.documentTemplates, config.documentTemplates || [], 'templateKey'),
      integrations: this.mergeArrayByKey(result.integrations, config.integrations || [], 'integrationKey'),
      modules: this.mergeArrayByKey(result.modules, config.modules || [], 'moduleKey'),
      settings: merge({}, result.settings, config.settings || {}),
    };
  }

  /**
   * Merge arrays by a key field
   * Items with the same key are merged, new items are appended
   */
  private static mergeArrayByKey<T extends Record<string, unknown>>(
    existing: T[],
    incoming: T[],
    keyField: keyof T
  ): T[] {
    const result = [...existing];

    for (const item of incoming) {
      const key = item[keyField];
      const existingIndex = result.findIndex((e) => e[keyField] === key);

      if (existingIndex >= 0) {
        // Merge with existing
        result[existingIndex] = merge({}, result[existingIndex], item);
      } else {
        // Append new
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Get configuration preview for onboarding
   */
  static getPreview(
    template: IndustryTemplate,
    naicsCode?: string
  ): {
    pipelines: { name: string; type: string; stageCount: number }[];
    fields: { key: string; label: string; type: string }[];
    modules: { key: string; name: string }[];
    activityTypes: { key: string; name: string }[];
  } {
    const templateDef = TemplateDefinitions[template];

    return {
      pipelines: templateDef.defaultPipelines.map((p) => ({
        name: p.name,
        type: p.pipelineType,
        stageCount: p.stages.length,
      })),
      fields: templateDef.defaultFields.map((f) => ({
        key: f.fieldKey,
        label: f.label,
        type: f.fieldType,
      })),
      modules: templateDef.defaultModules.map((key) => ({
        key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      })),
      activityTypes: templateDef.defaultActivityTypes.map((a) => ({
        key: a.activityKey,
        name: a.name,
      })),
    };
  }
}
