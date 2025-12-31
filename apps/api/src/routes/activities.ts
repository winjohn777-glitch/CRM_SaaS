import type { FastifyPluginAsync } from 'fastify';
import { activityRepository } from '@crm/db';
import { CreateActivitySchema, UpdateActivitySchema, ActivityFiltersSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const activityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // List activities
  fastify.get('/', async (request) => {
    const query = request.query as Record<string, string | undefined>;

    const filters = ActivityFiltersSchema.parse({
      activityTypeKey: query.activityTypeKey,
      status: query.status,
      assignedToId: query.assignedToId,
      contactId: query.contactId,
      accountId: query.accountId,
      opportunityId: query.opportunityId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    const result = await activityRepository.findByTenant(request.tenantId, filters, {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 25,
      sortBy: query.sortBy || 'scheduledAt',
      sortOrder: (query.sortOrder as 'asc' | 'desc') || 'asc',
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  });

  // Get upcoming activities
  fastify.get('/upcoming', async (request) => {
    const query = request.query as { days?: string; userId?: string };
    const days = query.days ? parseInt(query.days, 10) : 7;

    const activities = await activityRepository.findUpcoming(
      request.tenantId,
      query.userId || request.userId,
      days
    );

    return { success: true, data: activities };
  });

  // Get overdue activities
  fastify.get('/overdue', async (request) => {
    const query = request.query as { userId?: string };

    const activities = await activityRepository.findOverdue(
      request.tenantId,
      query.userId || request.userId
    );

    return { success: true, data: activities };
  });

  // Get calendar view
  fastify.get('/calendar', async (request, reply) => {
    const query = request.query as { startDate?: string; endDate?: string; userId?: string };

    if (!query.startDate || !query.endDate) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'startDate and endDate are required' },
      });
    }

    const activities = await activityRepository.getCalendarView(
      request.tenantId,
      new Date(query.startDate),
      new Date(query.endDate),
      query.userId
    );

    return { success: true, data: activities };
  });

  // Get single activity
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const activity = await activityRepository.findById(id);

    if (!activity || activity.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Activity not found' },
      });
    }

    return { success: true, data: activity };
  });

  // Create activity
  fastify.post('/', async (request, reply) => {
    try {
      const input = CreateActivitySchema.parse(request.body);
      const activity = await activityRepository.create({
        ...input,
        tenantId: request.tenantId,
        createdById: request.userId,
        assignedToId: input.assignedToId || request.userId,
      });

      return reply.status(201).send({ success: true, data: activity });
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

  // Update activity
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await activityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Activity not found' },
      });
    }

    try {
      const input = UpdateActivitySchema.parse(request.body);
      const activity = await activityRepository.update(id, input);
      return { success: true, data: activity };
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

  // Complete activity
  fastify.post('/:id/complete', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await activityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Activity not found' },
      });
    }

    const activity = await activityRepository.complete(id);
    return { success: true, data: activity };
  });

  // Cancel activity
  fastify.post('/:id/cancel', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await activityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Activity not found' },
      });
    }

    const activity = await activityRepository.cancel(id);
    return { success: true, data: activity };
  });

  // Delete activity
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await activityRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Activity not found' },
      });
    }

    await activityRepository.delete(id);
    return { success: true };
  });
};
