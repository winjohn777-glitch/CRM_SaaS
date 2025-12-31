import type { FastifyPluginAsync } from 'fastify';
import { configurationRegistry, NAICSUtils } from '@crm/config';
import { InitializeTenantSchema, PreviewConfigSchema } from '@crm/validation';
import { authenticate } from '../middleware/auth';

export const configRoutes: FastifyPluginAsync = async (fastify) => {
  // Public routes for onboarding preview
  fastify.get('/templates', async () => {
    const templates = configurationRegistry.getAvailableTemplates();
    return { success: true, data: templates };
  });

  fastify.get('/sectors', async () => {
    const sectors = configurationRegistry.getAllSectors();
    return { success: true, data: sectors };
  });

  fastify.get('/preview', async (request) => {
    const query = request.query as { template?: string; naicsCode?: string };

    try {
      const input = PreviewConfigSchema.parse({
        industryTemplate: query.template,
        naicsCode: query.naicsCode,
      });

      if (!input.industryTemplate) {
        return {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Template is required' },
        };
      }

      const preview = configurationRegistry.previewConfiguration(
        input.industryTemplate,
        input.naicsCode
      );

      return { success: true, data: preview };
    } catch (error) {
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters' },
      };
    }
  });

  fastify.get('/naics/:code', async (request, reply) => {
    const { code } = request.params as { code: string };

    if (!NAICSUtils.isValid(code)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_NAICS', message: 'Invalid NAICS code format' },
      });
    }

    const hierarchy = NAICSUtils.getHierarchy(code);
    const level = NAICSUtils.getLevel(code);
    const sector = NAICSUtils.getSector(code);
    const template = configurationRegistry.getTemplateForSector(sector);

    return {
      success: true,
      data: {
        code,
        level,
        hierarchy,
        sector,
        sectorName: NAICSUtils.getSectorName(sector),
        template,
      },
    };
  });

  // Protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authenticate);

    // Get current tenant configuration
    protectedRoutes.get('/current', async (request) => {
      // In a real implementation, you'd fetch the tenant's stored config
      // For now, return based on their template/NAICS
      const config = configurationRegistry.getConfiguration(null);

      return { success: true, data: config };
    });

    // Initialize tenant with configuration
    protectedRoutes.post('/initialize', async (request, reply) => {
      if (!['OWNER', 'ADMIN'].includes(request.userRole)) {
        return reply.status(403).send({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
      }

      try {
        const input = InitializeTenantSchema.parse(request.body);

        // Get the merged configuration
        const config = input.naicsCode
          ? configurationRegistry.getConfiguration(input.naicsCode)
          : configurationRegistry.getTemplateConfiguration(input.industryTemplate);

        // In a real implementation:
        // 1. Update tenant with industryTemplate and naicsCode
        // 2. Create default pipelines from config
        // 3. Enable default features
        // 4. Enable default modules
        // 5. Create custom field definitions

        return {
          success: true,
          data: {
            template: config.template,
            naicsCode: input.naicsCode,
            pipelinesCreated: config.pipelines.length,
            fieldsCreated: config.customFields.length,
            modulesEnabled: config.modules.filter((m) => m.isEnabled).length,
          },
        };
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

    // Get default pipelines for template
    protectedRoutes.get('/pipelines/:template', async (request, reply) => {
      const { template } = request.params as { template: string };

      try {
        const pipelines = configurationRegistry.getDefaultPipelines(template as any);
        return { success: true, data: pipelines };
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: { code: 'INVALID_TEMPLATE', message: 'Invalid template' },
        });
      }
    });

    // Get default fields for template
    protectedRoutes.get('/fields/:template', async (request, reply) => {
      const { template } = request.params as { template: string };

      try {
        const fields = configurationRegistry.getDefaultCustomFields(template as any);
        return { success: true, data: fields };
      } catch (error) {
        return reply.status(400).send({
          success: false,
          error: { code: 'INVALID_TEMPLATE', message: 'Invalid template' },
        });
      }
    });

    // Get available modules
    protectedRoutes.get('/modules/available', async (request) => {
      const query = request.query as { naicsCode?: string };

      if (query.naicsCode) {
        // Get modules for NAICS code
        // This would use moduleRegistry.getModulesForNAICS()
        return { success: true, data: [] };
      }

      return { success: true, data: [] };
    });
  });
};
