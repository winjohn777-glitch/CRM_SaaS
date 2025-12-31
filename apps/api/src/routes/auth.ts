import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from '@crm/validation';
import { userRepository, tenantRepository } from '@crm/db';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register new tenant and user
  fastify.post('/register', async (request, reply) => {
    try {
      const input = RegisterSchema.parse(request.body);

      // Check if tenant slug already exists
      const existingTenant = await tenantRepository.findBySlug(input.tenantSlug);
      if (existingTenant) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'TENANT_EXISTS',
            message: 'A company with this slug already exists',
          },
        });
      }

      // Create tenant
      const tenant = await tenantRepository.create({
        name: input.tenantName,
        slug: input.tenantSlug,
        industryTemplate: input.industryTemplate as any,
        naicsCode: input.naicsCode,
      });

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 10);

      // Create owner user
      const user = await userRepository.create({
        tenantId: tenant.id,
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: 'OWNER',
      });

      // Generate tokens
      const accessToken = fastify.jwt.sign({
        sub: user.id,
        tenantId: tenant.id,
        role: user.role,
      });

      const refreshToken = fastify.jwt.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await userRepository.createRefreshToken(user.id, refreshToken, expiresAt);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          expiresIn: 900, // 15 minutes
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tenant: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
          },
        },
      };
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

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const input = LoginSchema.parse(request.body);

      // Find tenant first if slug provided
      let tenantId: string | undefined;
      if (input.tenantSlug) {
        const tenant = await tenantRepository.findBySlug(input.tenantSlug);
        if (!tenant) {
          return reply.status(401).send({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password',
            },
          });
        }
        tenantId = tenant.id;
      }

      // For now, we need tenantSlug - in production you might lookup by email across tenants
      if (!tenantId) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'TENANT_REQUIRED',
            message: 'Company slug is required',
          },
        });
      }

      // Find user
      const user = await userRepository.findByEmail(tenantId, input.email);
      if (!user || !user.passwordHash) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(input.password, user.passwordHash);
      if (!validPassword) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      // Check if active
      if (!user.isActive) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: 'Your account has been disabled',
          },
        });
      }

      // Update last login
      await userRepository.updateLastLogin(user.id);

      // Get tenant
      const tenant = await tenantRepository.findById(user.tenantId);

      // Generate tokens
      const accessToken = fastify.jwt.sign({
        sub: user.id,
        tenantId: user.tenantId,
        role: user.role,
      });

      const refreshToken = fastify.jwt.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await userRepository.createRefreshToken(user.id, refreshToken, expiresAt);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
          expiresIn: 900,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          tenant: tenant ? {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            industryTemplate: tenant.industryTemplate,
          } : null,
        },
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

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    try {
      const input = RefreshTokenSchema.parse(request.body);

      // Find refresh token
      const tokenRecord = await userRepository.findRefreshToken(input.refreshToken);
      if (!tokenRecord) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid refresh token',
          },
        });
      }

      // Check if expired
      if (tokenRecord.expiresAt < new Date()) {
        await userRepository.deleteRefreshToken(input.refreshToken);
        return reply.status(401).send({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Refresh token has expired',
          },
        });
      }

      const user = tokenRecord.user;

      // Delete old refresh token
      await userRepository.deleteRefreshToken(input.refreshToken);

      // Generate new tokens
      const accessToken = fastify.jwt.sign({
        sub: user.id,
        tenantId: user.tenantId,
        role: user.role,
      });

      const newRefreshToken = fastify.jwt.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      // Store new refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await userRepository.createRefreshToken(user.id, newRefreshToken, expiresAt);

      return {
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: 900,
        },
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

  // Logout
  fastify.post('/logout', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken?: string };

    if (refreshToken) {
      await userRepository.deleteRefreshToken(refreshToken);
    }

    return { success: true };
  });
};
