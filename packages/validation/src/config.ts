import { z } from 'zod';
import {
  IndustryTemplateSchema,
  PipelineTypeSchema,
  CustomFieldTypeSchema,
  CRMEntityTypeSchema,
  ActivityCategorySchema,
} from './enums';

export const InitializeTenantSchema = z.object({
  industryTemplate: IndustryTemplateSchema,
  naicsCode: z.string().optional(),
  features: z.array(z.string()).optional(),
  modules: z.array(z.string()).optional(),
});

export const PreviewConfigSchema = z.object({
  industryTemplate: IndustryTemplateSchema.optional(),
  naicsCode: z.string().optional(),
});

export const CustomFieldOptionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isDefault: z.boolean().optional(),
});

export const CreateCustomFieldSchema = z.object({
  fieldKey: z
    .string()
    .min(1, 'Field key is required')
    .max(50)
    .regex(/^[a-z_][a-z0-9_]*$/, 'Field key must be lowercase with underscores'),
  label: z.string().min(1, 'Label is required').max(100),
  description: z.string().max(500).optional(),
  fieldType: CustomFieldTypeSchema,
  entityType: CRMEntityTypeSchema,
  options: z.array(CustomFieldOptionSchema).optional(),
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
      patternMessage: z.string().optional(),
      required: z.boolean().optional(),
    })
    .optional(),
  isRequired: z.boolean().optional(),
  isSearchable: z.boolean().optional(),
  isFilterable: z.boolean().optional(),
  defaultValue: z.string().optional(),
  placeholder: z.string().max(100).optional(),
  helpText: z.string().max(200).optional(),
  sortOrder: z.number().int().optional(),
  groupName: z.string().max(50).optional(),
});

export const UpdateCustomFieldSchema = CreateCustomFieldSchema.partial().omit({
  fieldKey: true,
  entityType: true,
});

export const CreateActivityTypeSchema = z.object({
  activityKey: z
    .string()
    .min(1, 'Activity key is required')
    .max(50)
    .regex(/^[a-z_][a-z0-9_]*$/),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  category: ActivityCategorySchema,
  durationDefault: z.number().positive().optional(),
  isSchedulable: z.boolean().optional(),
  isLoggable: z.boolean().optional(),
  requiresLocation: z.boolean().optional(),
  requiredCustomFields: z.array(z.string()).optional(),
});

export const UpdateActivityTypeSchema = CreateActivityTypeSchema.partial().omit({
  activityKey: true,
});

export const NAICSCodeSchema = z.object({
  code: z.string().min(2).max(6),
  title: z.string(),
  description: z.string().optional(),
  level: z.enum(['sector', 'subsector', 'industry-group', 'naics-industry', 'national-industry']),
  parentCode: z.string().optional(),
});

export type InitializeTenantInput = z.infer<typeof InitializeTenantSchema>;
export type PreviewConfigInput = z.infer<typeof PreviewConfigSchema>;
export type CreateCustomFieldInput = z.infer<typeof CreateCustomFieldSchema>;
export type UpdateCustomFieldInput = z.infer<typeof UpdateCustomFieldSchema>;
export type CreateActivityTypeInput = z.infer<typeof CreateActivityTypeSchema>;
export type UpdateActivityTypeInput = z.infer<typeof UpdateActivityTypeSchema>;
