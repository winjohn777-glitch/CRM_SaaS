import type { FastifyPluginAsync } from 'fastify';
import { accountRepository } from '@crm/db';
import { CreateAccountSchema, UpdateAccountSchema, AccountFiltersSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const accountRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // List accounts
  fastify.get('/', async (request) => {
    const query = request.query as {
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      accountType?: string;
      industry?: string;
      search?: string;
    };

    const filters = AccountFiltersSchema.parse({
      accountType: query.accountType,
      industry: query.industry,
      search: query.search,
    });

    const result = await accountRepository.findByTenant(request.tenantId, filters, {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 25,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  });

  // Get single account
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const account = await accountRepository.findById(id);

    if (!account || account.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Account not found' },
      });
    }

    return { success: true, data: account };
  });

  // Create account
  fastify.post('/', async (request, reply) => {
    try {
      const input = CreateAccountSchema.parse(request.body);
      const account = await accountRepository.create({
        ...input,
        tenantId: request.tenantId,
      });

      return reply.status(201).send({ success: true, data: account });
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

  // Update account
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await accountRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Account not found' },
      });
    }

    try {
      const input = UpdateAccountSchema.parse(request.body);
      const account = await accountRepository.update(id, input);
      return { success: true, data: account };
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

  // Delete account
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = await accountRepository.findById(id);

    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Account not found' },
      });
    }

    await accountRepository.delete(id);
    return { success: true };
  });

  // Get account hierarchy
  fastify.get('/:id/hierarchy', async (request, reply) => {
    const { id } = request.params as { id: string };
    const hierarchy = await accountRepository.getHierarchy(id);

    if (!hierarchy || hierarchy.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Account not found' },
      });
    }

    return { success: true, data: hierarchy };
  });
};
