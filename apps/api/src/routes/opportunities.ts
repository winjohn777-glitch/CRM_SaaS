import type { FastifyPluginAsync } from 'fastify';
import { opportunityRepository } from '@crm/db';
import {
  CreateOpportunitySchema,
  UpdateOpportunitySchema,
  OpportunityFiltersSchema,
  MoveOpportunitySchema,
} from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const opportunityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // List opportunities
  fastify.get('/', async (request) => {
    const query = request.query as Record<string, string | undefined>;

    const filters = OpportunityFiltersSchema.parse({
      pipelineId: query.pipelineId,
      stageId: query.stageId,
      status: query.status,
      assignedToId: query.assignedToId,
      accountId: query.accountId,
      search: query.search,
      minAmount: query.minAmount ? parseFloat(query.minAmount) : undefined,
      maxAmount: query.maxAmount ? parseFloat(query.maxAmount) : undefined,
    });

    const result = await opportunityRepository.findByTenant(request.tenantId, filters, {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 25,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder as 'asc' | 'desc',
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  });

  // Get pipeline board view
  fastify.get('/board/:pipelineId', async (request) => {
    const { pipelineId } = request.params as { pipelineId: string };
    const opportunities = await opportunityRepository.findByPipeline(request.tenantId, pipelineId);

    return { success: true, data: opportunities };
  });

  // Get pipeline statistics
  fastify.get('/stats/:pipelineId', async (request) => {
    const { pipelineId } = request.params as { pipelineId: string };
    const stats = await opportunityRepository.getPipelineStats(request.tenantId, pipelineId);

    return { success: true, data: stats };
  });

  // Get single opportunity
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const opportunity = await opportunityRepository.findById(id);

    if (!opportunity || opportunity.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    return { success: true, data: opportunity };
  });

  // Create opportunity
  fastify.post('/', async (request, reply) => {
    try {
      const input = CreateOpportunitySchema.parse(request.body);
      const opportunity = await opportunityRepository.create({
        ...input,
        tenantId: request.tenantId,
      });

      return reply.status(201).send({ success: true, data: opportunity });
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

  // Update opportunity
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await opportunityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    try {
      const input = UpdateOpportunitySchema.parse(request.body);
      const opportunity = await opportunityRepository.update(id, input);
      return { success: true, data: opportunity };
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

  // Move opportunity to stage
  fastify.post('/:id/move', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await opportunityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    try {
      const input = MoveOpportunitySchema.parse(request.body);
      const opportunity = await opportunityRepository.moveToStage(id, input.stageId, input.probability);
      return { success: true, data: opportunity };
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

  // Mark opportunity as won
  fastify.post('/:id/won', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { wonReason } = request.body as { wonReason?: string };

    const existing = await opportunityRepository.findById(id);
    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    const opportunity = await opportunityRepository.markWon(id, wonReason);
    return { success: true, data: opportunity };
  });

  // Mark opportunity as lost
  fastify.post('/:id/lost', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { lostReason } = request.body as { lostReason?: string };

    const existing = await opportunityRepository.findById(id);
    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    const opportunity = await opportunityRepository.markLost(id, lostReason);
    return { success: true, data: opportunity };
  });

  // Delete opportunity
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await opportunityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
    }

    await opportunityRepository.delete(id);
    return { success: true };
  });
};
