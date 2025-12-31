import type { FastifyPluginAsync } from 'fastify';
import { tenantRepository } from '@crm/db';
import { UpdateTenantSchema, SetFeatureSchema, SetModuleSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const tenantRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes require authentication
  fastify.addHook('onRequest', authenticate);

  // Get current tenant
  fastify.get('/', async (request) => {
    const tenant = await tenantRepository.findById(request.tenantId);

    if (!tenant) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Tenant not found',
        },
      };
    }

    return {
      success: true,
      data: tenant,
    };
  });

  // Update tenant
  fastify.put('/', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only owners and admins can update tenant settings',
        },
      });
    }

    try {
      const input = UpdateTenantSchema.parse(request.body);
      const tenant = await tenantRepository.update(request.tenantId, input);

      return {
        success: true,
        data: tenant,
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

  // Get tenant features
  fastify.get('/features', async (request) => {
    const features = await tenantRepository.getFeatures(request.tenantId);

    return {
      success: true,
      data: features,
    };
  });

  // Set feature
  fastify.post('/features', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only owners and admins can manage features',
        },
      });
    }

    try {
      const input = SetFeatureSchema.parse(request.body);
      const feature = await tenantRepository.setFeature(
        request.tenantId,
        input.featureKey,
        input.enabled,
        input.config
      );

      return {
        success: true,
        data: feature,
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

  // Get tenant modules
  fastify.get('/modules', async (request) => {
    const modules = await tenantRepository.getModules(request.tenantId);

    return {
      success: true,
      data: modules,
    };
  });

  // Set module
  fastify.post('/modules', async (request, reply) => {
    if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only owners and admins can manage modules',
        },
      });
    }

    try {
      const input = SetModuleSchema.parse(request.body);
      const module = await tenantRepository.setModule(
        request.tenantId,
        input.moduleKey,
        input.enabled,
        input.config
      );

      return {
        success: true,
        data: module,
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

  // Get custom fields
  fastify.get('/custom-fields', async (request) => {
    const { entityType } = request.query as { entityType?: string };
    const fields = await tenantRepository.getCustomFields(request.tenantId, entityType);

    return {
      success: true,
      data: fields,
    };
  });
};
