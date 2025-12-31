import { z } from 'zod';
import { IndustryTemplateSchema, UserRoleSchema } from './enums';

export const CreateTenantSchema = z.object({
  name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().optional(),
  industryTemplate: IndustryTemplateSchema.optional(),
  naicsCode: z.string().optional(),
  naicsCodes: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  locale: z.string().optional(),
});

export const UpdateTenantSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  domain: z.string().optional(),
  logo: z.string().url().optional(),
  industryTemplate: IndustryTemplateSchema.optional(),
  naicsCode: z.string().optional(),
  naicsCodes: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3).optional(),
  locale: z.string().optional(),
});

export const SetFeatureSchema = z.object({
  featureKey: z.string().min(1, 'Feature key is required'),
  enabled: z.boolean(),
  config: z.record(z.unknown()).optional(),
});

export const SetModuleSchema = z.object({
  moduleKey: z.string().min(1, 'Module key is required'),
  enabled: z.boolean(),
  config: z.record(z.unknown()).optional(),
});

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().max(20).optional(),
  role: UserRoleSchema.optional(),
  password: z.string().min(8).optional(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional(),
  role: UserRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

export const InviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  role: UserRoleSchema.optional(),
});

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>;
export type SetFeatureInput = z.infer<typeof SetFeatureSchema>;
export type SetModuleInput = z.infer<typeof SetModuleSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type InviteUserInput = z.infer<typeof InviteUserSchema>;
