import { z } from 'zod';
import { PipelineTypeSchema } from './enums';

export const CreateStageSchema = z.object({
  name: z
    .string()
    .min(1, 'Stage name is required')
    .max(100, 'Stage name must be less than 100 characters'),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  probability: z.number().min(0).max(100).optional(),
  isInitial: z.boolean().optional(),
  isFinal: z.boolean().optional(),
  isWon: z.boolean().optional(),
  isLost: z.boolean().optional(),
  requiredFields: z.array(z.string()).optional(),
});

export const CreatePipelineSchema = z.object({
  name: z
    .string()
    .min(1, 'Pipeline name is required')
    .max(100, 'Pipeline name must be less than 100 characters'),
  description: z.string().max(500).optional(),
  pipelineType: PipelineTypeSchema,
  isDefault: z.boolean().optional(),
  stages: z.array(CreateStageSchema).optional(),
});

export const UpdatePipelineSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const UpdateStageSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  probability: z.number().min(0).max(100).optional(),
  isInitial: z.boolean().optional(),
  isFinal: z.boolean().optional(),
  isWon: z.boolean().optional(),
  isLost: z.boolean().optional(),
  requiredFields: z.array(z.string()).optional(),
});

export const PipelineIdSchema = z.object({
  id: z.string().cuid('Invalid pipeline ID'),
});

export const StageIdSchema = z.object({
  id: z.string().cuid('Invalid stage ID'),
});

export const ReorderStagesSchema = z.object({
  stageIds: z.array(z.string().cuid()).min(1, 'At least one stage ID is required'),
});

export type CreatePipelineInput = z.infer<typeof CreatePipelineSchema>;
export type UpdatePipelineInput = z.infer<typeof UpdatePipelineSchema>;
export type CreateStageInput = z.infer<typeof CreateStageSchema>;
export type UpdateStageInput = z.infer<typeof UpdateStageSchema>;
export type ReorderStagesInput = z.infer<typeof ReorderStagesSchema>;
