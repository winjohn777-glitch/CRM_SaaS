import type { FastifyPluginAsync } from 'fastify';
import { contactRepository } from '@crm/db';
import { CreateContactSchema, UpdateContactSchema, ContactFiltersSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const contactRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // List contacts
  fastify.get('/', async (request) => {
    const query = request.query as {
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
      accountId?: string;
      search?: string;
    };

    const filters = ContactFiltersSchema.parse({
      status: query.status,
      accountId: query.accountId,
      search: query.search,
    });

    const result = await contactRepository.findByTenant(request.tenantId, filters, {
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

  // Get single contact
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const contact = await contactRepository.findById(id);

    if (!contact || contact.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    return {
      success: true,
      data: contact,
    };
  });

  // Create contact
  fastify.post('/', async (request, reply) => {
    try {
      const input = CreateContactSchema.parse(request.body);

      const contact = await contactRepository.create({
        ...input,
        tenantId: request.tenantId,
        createdById: request.userId,
      });

      return reply.status(201).send({
        success: true,
        data: contact,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: error,
          },
        });
      }
      throw error;
    }
  });

  // Update contact
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Verify contact belongs to tenant
    const existing = await contactRepository.findById(id);
    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    try {
      const input = UpdateContactSchema.parse(request.body);
      const contact = await contactRepository.update(id, input);

      return {
        success: true,
        data: contact,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
          },
        });
      }
      throw error;
    }
  });

  // Delete contact
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Verify contact belongs to tenant
    const existing = await contactRepository.findById(id);
    if (!existing || existing.tenantId !== request.tenantId) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact not found',
        },
      });
    }

    await contactRepository.delete(id);

    return { success: true };
  });

  // Bulk delete contacts
  fastify.post('/bulk-delete', async (request, reply) => {
    const { ids } = request.body as { ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ids array is required',
        },
      });
    }

    const count = await contactRepository.bulkDelete(ids);

    return {
      success: true,
      data: { deleted: count },
    };
  });
};
