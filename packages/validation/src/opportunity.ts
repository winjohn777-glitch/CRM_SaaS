import { z } from 'zod';
import { OpportunityStatusSchema } from './enums';

export const CreateOpportunitySchema = z.object({
  name: z
    .string()
    .min(1, 'Opportunity name is required')
    .max(200, 'Opportunity name must be less than 200 characters'),
  description: z.string().max(5000, 'Description must be less than 5000 characters').optional(),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  probability: z.number().min(0).max(100, 'Probability must be between 0 and 100').optional(),
  expectedCloseDate: z.string().datetime().optional().or(z.date().optional()),
  pipelineId: z.string().cuid('Invalid pipeline ID'),
  stageId: z.string().cuid('Invalid stage ID'),
  accountId: z.string().cuid().optional(),
  primaryContactId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const UpdateOpportunitySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  amount: z.number().min(0).optional(),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().datetime().optional().or(z.date().optional()),
  actualCloseDate: z.string().datetime().optional().or(z.date().optional()),
  stageId: z.string().cuid().optional(),
  accountId: z.string().cuid().optional(),
  primaryContactId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  status: OpportunityStatusSchema.optional(),
  lostReason: z.string().max(500).optional(),
  wonReason: z.string().max(500).optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const MoveOpportunitySchema = z.object({
  stageId: z.string().cuid('Invalid stage ID'),
  probability: z.number().min(0).max(100).optional(),
});

export const OpportunityFiltersSchema = z.object({
  pipelineId: z.string().cuid().optional(),
  stageId: z.string().cuid().optional(),
  status: OpportunityStatusSchema.optional(),
  assignedToId: z.string().cuid().optional(),
  accountId: z.string().cuid().optional(),
  search: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  closeDateFrom: z.string().datetime().optional(),
  closeDateTo: z.string().datetime().optional(),
});

export const OpportunityIdSchema = z.object({
  id: z.string().cuid('Invalid opportunity ID'),
});

export const MarkWonSchema = z.object({
  wonReason: z.string().max(500).optional(),
});

export const MarkLostSchema = z.object({
  lostReason: z.string().max(500).optional(),
});

export type CreateOpportunityInput = z.infer<typeof CreateOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof UpdateOpportunitySchema>;
export type MoveOpportunityInput = z.infer<typeof MoveOpportunitySchema>;
export type OpportunityFilters = z.infer<typeof OpportunityFiltersSchema>;
