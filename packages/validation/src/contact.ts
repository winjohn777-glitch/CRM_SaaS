import { z } from 'zod';
import { ContactStatusSchema } from './enums';

export const CreateContactSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  mobile: z.string().max(20, 'Mobile must be less than 20 characters').optional(),
  title: z.string().max(100, 'Title must be less than 100 characters').optional(),
  department: z.string().max(100, 'Department must be less than 100 characters').optional(),
  addressLine1: z.string().max(200, 'Address must be less than 200 characters').optional(),
  addressLine2: z.string().max(200, 'Address must be less than 200 characters').optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional(),
  state: z.string().max(50, 'State must be less than 50 characters').optional(),
  postalCode: z.string().max(20, 'Postal code must be less than 20 characters').optional(),
  country: z.string().max(50, 'Country must be less than 50 characters').optional(),
  linkedIn: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter: z.string().max(50, 'Twitter handle must be less than 50 characters').optional(),
  accountId: z.string().cuid().optional(),
  source: z.string().max(100, 'Source must be less than 100 characters').optional(),
  status: ContactStatusSchema.optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial();

export const ContactFiltersSchema = z.object({
  status: ContactStatusSchema.optional(),
  accountId: z.string().cuid().optional(),
  search: z.string().optional(),
});

export const ContactIdSchema = z.object({
  id: z.string().cuid('Invalid contact ID'),
});

export const BulkDeleteContactsSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one ID is required'),
});

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type ContactFilters = z.infer<typeof ContactFiltersSchema>;
