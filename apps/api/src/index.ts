import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { tenantRoutes } from './routes/tenant';
import { contactRoutes } from './routes/contacts';
import { accountRoutes } from './routes/accounts';
import { opportunityRoutes } from './routes/opportunities';
import { activityRoutes } from './routes/activities';
import { pipelineRoutes } from './routes/pipelines';
import { configRoutes } from './routes/config';

const PORT = parseInt(process.env.PORT || '4001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function main() {
  // Register plugins
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  await fastify.register(helmet);

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    },
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API version prefix
  fastify.register(async (app) => {
    // Auth routes (public)
    await app.register(authRoutes, { prefix: '/auth' });

    // Protected routes
    await app.register(tenantRoutes, { prefix: '/tenant' });
    await app.register(configRoutes, { prefix: '/config' });
    await app.register(contactRoutes, { prefix: '/crm/contacts' });
    await app.register(accountRoutes, { prefix: '/crm/accounts' });
    await app.register(opportunityRoutes, { prefix: '/crm/opportunities' });
    await app.register(activityRoutes, { prefix: '/crm/activities' });
    await app.register(pipelineRoutes, { prefix: '/crm/pipelines' });
  }, { prefix: '/api/v1' });

  // Start server
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`CRM API server running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
