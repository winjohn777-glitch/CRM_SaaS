import { z } from 'zod';
import { ActivityStatusSchema } from './enums';

export const CreateActivitySchema = z.object({
  activityTypeKey: z.string().min(1, 'Activity type is required'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  scheduledAt: z.string().datetime().optional().or(z.date().optional()),
  dueAt: z.string().datetime().optional().or(z.date().optional()),
  durationMinutes: z.number().positive('Duration must be positive').optional(),
  locationName: z.string().max(200).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactId: z.string().cuid().optional(),
  accountId: z.string().cuid().optional(),
  opportunityId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  priority: z.number().min(0).max(10).optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const UpdateActivitySchema = z.object({
  activityTypeKey: z.string().optional(),
  subject: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  scheduledAt: z.string().datetime().optional().or(z.date().optional()),
  dueAt: z.string().datetime().optional().or(z.date().optional()),
  completedAt: z.string().datetime().optional().or(z.date().optional()),
  durationMinutes: z.number().positive().optional(),
  locationName: z.string().max(200).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactId: z.string().cuid().optional(),
  accountId: z.string().cuid().optional(),
  opportunityId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  status: ActivityStatusSchema.optional(),
  priority: z.number().min(0).max(10).optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const ActivityFiltersSchema = z.object({
  activityTypeKey: z.string().optional(),
  status: ActivityStatusSchema.optional(),
  assignedToId: z.string().cuid().optional(),
  contactId: z.string().cuid().optional(),
  accountId: z.string().cuid().optional(),
  opportunityId: z.string().cuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export const ActivityIdSchema = z.object({
  id: z.string().cuid('Invalid activity ID'),
});

export const CalendarViewSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  userId: z.string().cuid().optional(),
});

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;
export type ActivityFilters = z.infer<typeof ActivityFiltersSchema>;
export type CalendarViewInput = z.infer<typeof CalendarViewSchema>;
