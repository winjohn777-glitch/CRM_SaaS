import { prisma } from '../client';
import type { Prisma, Tenant, IndustryTemplate } from '@prisma/client';

export interface CreateTenantInput {
  name: string;
  slug: string;
  domain?: string;
  industryTemplate?: IndustryTemplate;
  naicsCode?: string;
  naicsCodes?: string[];
  settings?: Prisma.InputJsonValue;
  timezone?: string;
  currency?: string;
  locale?: string;
}

export interface UpdateTenantInput {
  name?: string;
  domain?: string;
  logo?: string;
  industryTemplate?: IndustryTemplate;
  naicsCode?: string;
  naicsCodes?: string[];
  settings?: Prisma.InputJsonValue;
  timezone?: string;
  currency?: string;
  locale?: string;
}

export class TenantRepository {
  async create(data: CreateTenantInput): Promise<Tenant> {
    return prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        industryTemplate: data.industryTemplate,
        naicsCode: data.naicsCode,
        naicsCodes: data.naicsCodes || [],
        settings: data.settings || {},
        timezone: data.timezone || 'America/New_York',
        currency: data.currency || 'USD',
        locale: data.locale || 'en-US',
      },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { slug },
    });
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { domain },
    });
  }

  async update(id: string, data: UpdateTenantInput): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.tenant.delete({
      where: { id },
    });
  }

  async getFeatures(tenantId: string) {
    return prisma.tenantFeature.findMany({
      where: { tenantId },
    });
  }

  async setFeature(
    tenantId: string,
    featureKey: string,
    enabled: boolean,
    config?: Prisma.InputJsonValue
  ) {
    return prisma.tenantFeature.upsert({
      where: {
        tenantId_featureKey: { tenantId, featureKey },
      },
      update: { enabled, config },
      create: { tenantId, featureKey, enabled, config },
    });
  }

  async getModules(tenantId: string) {
    return prisma.tenantModule.findMany({
      where: { tenantId },
    });
  }

  async setModule(
    tenantId: string,
    moduleKey: string,
    enabled: boolean,
    config?: Prisma.InputJsonValue
  ) {
    return prisma.tenantModule.upsert({
      where: {
        tenantId_moduleKey: { tenantId, moduleKey },
      },
      update: { enabled, config },
      create: { tenantId, moduleKey, enabled, config },
    });
  }

  async getCustomFields(tenantId: string, entityType?: string) {
    return prisma.tenantCustomField.findMany({
      where: {
        tenantId,
        ...(entityType && { entityType: entityType as any }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

export const tenantRepository = new TenantRepository();
