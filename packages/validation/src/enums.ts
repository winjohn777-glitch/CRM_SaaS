import { z } from 'zod';

export const ContactStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'PROSPECT',
  'CUSTOMER',
  'FORMER_CUSTOMER',
]);

export const AccountTypeSchema = z.enum([
  'PROSPECT',
  'CUSTOMER',
  'PARTNER',
  'VENDOR',
  'COMPETITOR',
]);

export const OpportunityStatusSchema = z.enum(['OPEN', 'WON', 'LOST']);

export const ActivityStatusSchema = z.enum([
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const PipelineTypeSchema = z.enum([
  'SALES',
  'SERVICE',
  'PROJECT',
  'SUPPORT',
  'ONBOARDING',
  'RENEWAL',
  'CUSTOM',
]);

export const ActivityCategorySchema = z.enum([
  'CALL',
  'EMAIL',
  'MEETING',
  'SITE_VISIT',
  'INSPECTION',
  'ESTIMATE',
  'PRESENTATION',
  'FOLLOW_UP',
  'TASK',
  'NOTE',
  'DOCUMENT',
  'CUSTOM',
]);

export const CustomFieldTypeSchema = z.enum([
  'TEXT',
  'TEXTAREA',
  'NUMBER',
  'DECIMAL',
  'CURRENCY',
  'DATE',
  'DATETIME',
  'BOOLEAN',
  'SELECT',
  'MULTI_SELECT',
  'EMAIL',
  'PHONE',
  'URL',
  'ADDRESS',
  'FILE',
  'IMAGE',
  'USER_REFERENCE',
  'ENTITY_REFERENCE',
  'FORMULA',
  'ROLLUP',
]);

export const CRMEntityTypeSchema = z.enum([
  'CONTACT',
  'ACCOUNT',
  'OPPORTUNITY',
  'ACTIVITY',
  'PROJECT',
  'INVOICE',
  'PRODUCT',
  'SERVICE',
]);

export const UserRoleSchema = z.enum([
  'OWNER',
  'ADMIN',
  'MANAGER',
  'MEMBER',
  'VIEWER',
]);

export const IndustryTemplateSchema = z.enum([
  'PROJECT_BASED',
  'SALES_FOCUSED',
  'SERVICE_BASED',
  'INVENTORY_BASED',
  'ASSET_BASED',
  'MEMBERSHIP_BASED',
  'HOSPITALITY_BASED',
  'CASE_BASED',
]);
