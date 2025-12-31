// Re-export types from @crm/types for convenience
export type {
  IndustryConfiguration,
  MergedConfiguration,
  PipelineConfiguration,
  PipelineStageConfiguration,
  CustomFieldConfiguration,
  CustomFieldOptionConfiguration,
  ActivityTypeConfiguration,
  DocumentTemplateConfiguration,
  IntegrationConfiguration,
  IndustryModuleConfiguration,
  TemplateDefinition,
  NAICSCode,
} from '@crm/types';

export { IndustryTemplate, PipelineType, CustomFieldType, CRMEntityType, ActivityCategory } from '@crm/types';

// Registry-specific types
export interface ConfigurationSource {
  type: 'universal' | 'template' | 'sector' | 'subsector' | 'industry';
  code?: string;
  priority: number;
}

export interface LoadedConfiguration {
  source: ConfigurationSource;
  config: Partial<import('@crm/types').IndustryConfiguration>;
}
