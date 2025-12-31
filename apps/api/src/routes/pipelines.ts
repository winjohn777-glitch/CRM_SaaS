import type { FastifyPluginAsync } from 'fastify';
import { pipelineRepository } from '@crm/db';
import { CreatePipelineSchema, UpdatePipelineSchema, CreateStageSchema, UpdateStageSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const pipelineRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // List pipelines
  fastify.get('/', async (request) => {
    const query = request.query as { type?: string };
    const pipelines = await pipelineRepository.findByTenant(
      request.tenantId,
      query.type as any
    );

    return { success: true, data: pipelines };
  });

  // Get single pipeline
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const pipeline = await pipelineRepository.findById(id);

    if (!pipeline || pipeline.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    return { success: true, data: pipeline };
  });

  // Create pipeline
  fastify.post('/', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    try {
      const input = CreatePipelineSchema.parse(request.body);

      let pipeline;
      if (input.stages && input.stages.length > 0) {
        pipeline = await pipelineRepository.createWithStages(
          {
            ...input,
            tenantId: request.tenantId,
            pipelineType: input.pipelineType as any,
          },
          input.stages
        );
      } else {
        pipeline = await pipelineRepository.create({
          ...input,
          tenantId: request.tenantId,
          pipelineType: input.pipelineType as any,
        });
      }

      return reply.status(201).send({ success: true, data: pipeline });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error },
        });
      }
      throw error;
    }
  });

  // Update pipeline
  fastify.put('/:id', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { id } = request.params as { id: string };
    const existing = await pipelineRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    try {
      const input = UpdatePipelineSchema.parse(request.body);
      const pipeline = await pipelineRepository.update(id, input);
      return { success: true, data: pipeline };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      throw error;
    }
  });

  // Delete pipeline
  fastify.delete('/:id', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { id } = request.params as { id: string };
    const existing = await pipelineRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    try {
      await pipelineRepository.delete(id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({
          success: false,
          error: { code: 'DELETE_FAILED', message: error.message },
        });
      }
      throw error;
    }
  });

  // Add stage to pipeline
  fastify.post('/:id/stages', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { id } = request.params as { id: string };
    const existing = await pipelineRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    try {
      const input = CreateStageSchema.parse(request.body);
      const stage = await pipelineRepository.addStage({
        ...input,
        pipelineId: id,
      });

      return reply.status(201).send({ success: true, data: stage });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      throw error;
    }
  });

  // Update stage
  fastify.put('/:pipelineId/stages/:stageId', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { pipelineId, stageId } = request.params as { pipelineId: string; stageId: string };
    const pipeline = await pipelineRepository.findById(pipelineId);

    if (!pipeline || pipeline.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    try {
      const input = UpdateStageSchema.parse(request.body);
      const stage = await pipelineRepository.updateStage(stageId, input);
      return { success: true, data: stage };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      throw error;
    }
  });

  // Delete stage
  fastify.delete('/:pipelineId/stages/:stageId', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { pipelineId, stageId } = request.params as { pipelineId: string; stageId: string };
    const pipeline = await pipelineRepository.findById(pipelineId);

    if (!pipeline || pipeline.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    try {
      await pipelineRepository.deleteStage(stageId);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({
          success: false,
          error: { code: 'DELETE_FAILED', message: error.message },
        });
      }
      throw error;
    }
  });

  // Reorder stages
  fastify.post('/:id/stages/reorder', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    const { id } = request.params as { id: string };
    const { stageIds } = request.body as { stageIds: string[] };

    const pipeline = await pipelineRepository.findById(id);
    if (!pipeline || pipeline.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pipeline not found' },
      });
    }

    await pipelineRepository.reorderStages(id, stageIds);
    return { success: true };
  });
};
