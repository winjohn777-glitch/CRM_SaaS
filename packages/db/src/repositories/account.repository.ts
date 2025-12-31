import { prisma } from '../client';
import type { CRMAccount, AccountType, Prisma } from '@prisma/client';

export interface CreateAccountInput {
  tenantId: string;
  name: string;
  website?: string;
  industry?: string;
  employeeCount?: string;
  annualRevenue?: number;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
  accountType?: AccountType;
  parentId?: string;
  customFields?: Prisma.InputJsonValue;
}

export interface UpdateAccountInput {
  name?: string;
  website?: string;
  industry?: string;
  employeeCount?: string;
  annualRevenue?: number;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
  accountType?: AccountType;
  parentId?: string;
  customFields?: Prisma.InputJsonValue;
}

export interface AccountFilters {
  accountType?: AccountType;
  industry?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AccountRepository {
  async create(data: CreateAccountInput): Promise<CRMAccount> {
    return prisma.cRMAccount.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        website: data.website,
        industry: data.industry,
        employeeCount: data.employeeCount,
        annualRevenue: data.annualRevenue,
        description: data.description,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country || 'US',
        phone: data.phone,
        fax: data.fax,
        accountType: data.accountType || 'PROSPECT',
        parentId: data.parentId,
        customFields: data.customFields || {},
      },
    });
  }

  async findById(id: string): Promise<CRMAccount | null> {
    return prisma.cRMAccount.findUnique({
      where: { id },
      include: {
        contacts: { take: 10, orderBy: { createdAt: 'desc' } },
        opportunities: { take: 10, orderBy: { createdAt: 'desc' } },
        activities: { take: 10, orderBy: { createdAt: 'desc' } },
        parent: true,
        children: true,
      },
    });
  }

  async findByTenant(
    tenantId: string,
    filters?: AccountFilters,
    pagination?: PaginationOptions
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 25;
    const skip = (page - 1) * limit;

    const where: Prisma.CRMAccountWhereInput = {
      tenantId,
      ...(filters?.accountType && { accountType: filters.accountType }),
      ...(filters?.industry && { industry: filters.industry }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { website: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [accounts, total] = await Promise.all([
      prisma.cRMAccount.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [pagination?.sortBy || 'createdAt']: pagination?.sortOrder || 'desc',
        },
        include: {
          _count: { select: { contacts: true, opportunities: true } },
        },
      }),
      prisma.cRMAccount.count({ where }),
    ]);

    return {
      data: accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateAccountInput): Promise<CRMAccount> {
    return prisma.cRMAccount.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cRMAccount.delete({
      where: { id },
    });
  }

  async getHierarchy(id: string) {
    const account = await prisma.cRMAccount.findUnique({
      where: { id },
      include: {
        parent: {
          include: { parent: true },
        },
        children: {
          include: { children: true },
        },
      },
    });
    return account;
  }
}

export const accountRepository = new AccountRepository();
