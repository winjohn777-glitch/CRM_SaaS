import { z } from 'zod';
import { AccountTypeSchema } from './enums';

export const CreateAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Company name must be less than 200 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  industry: z.string().max(100, 'Industry must be less than 100 characters').optional(),
  employeeCount: z.string().max(50, 'Employee count must be less than 50 characters').optional(),
  annualRevenue: z.number().positive('Annual revenue must be positive').optional(),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  addressLine1: z.string().max(200, 'Address must be less than 200 characters').optional(),
  addressLine2: z.string().max(200, 'Address must be less than 200 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(50, 'State must be less than 50 characters').optional(),
  postalCode: z.string().max(20, 'Postal code must be less than 20 characters').optional(),
  country: z.string().max(50, 'Country must be less than 50 characters').optional(),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  fax: z.string().max(20, 'Fax must be less than 20 characters').optional(),
  accountType: AccountTypeSchema.optional(),
  parentId: z.string().cuid().optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const UpdateAccountSchema = CreateAccountSchema.partial();

export const AccountFiltersSchema = z.object({
  accountType: AccountTypeSchema.optional(),
  industry: z.string().optional(),
  search: z.string().optional(),
});

export const AccountIdSchema = z.object({
  id: z.string().cuid('Invalid account ID'),
});

export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
export type AccountFilters = z.infer<typeof AccountFiltersSchema>;
