import { prisma } from '../client';
import type { CRMContact, ContactStatus, Prisma } from '@prisma/client';

export interface CreateContactInput {
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkedIn?: string;
  twitter?: string;
  accountId?: string;
  source?: string;
  status?: ContactStatus;
  customFields?: Prisma.InputJsonValue;
  createdById?: string;
}

export interface UpdateContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkedIn?: string;
  twitter?: string;
  accountId?: string;
  source?: string;
  status?: ContactStatus;
  customFields?: Prisma.InputJsonValue;
}

export interface ContactFilters {
  status?: ContactStatus;
  accountId?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ContactRepository {
  async create(data: CreateContactInput): Promise<CRMContact> {
    return prisma.cRMContact.create({
      data: {
        tenantId: data.tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email?.toLowerCase(),
        phone: data.phone,
        mobile: data.mobile,
        title: data.title,
        department: data.department,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country || 'US',
        linkedIn: data.linkedIn,
        twitter: data.twitter,
        accountId: data.accountId,
        source: data.source,
        status: data.status || 'ACTIVE',
        customFields: data.customFields || {},
        createdById: data.createdById,
      },
    });
  }

  async findById(id: string): Promise<CRMContact | null> {
    return prisma.cRMContact.findUnique({
      where: { id },
      include: {
        account: true,
        activities: { take: 10, orderBy: { createdAt: 'desc' } },
        opportunities: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async findByTenant(
    tenantId: string,
    filters?: ContactFilters,
    pagination?: PaginationOptions
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 25;
    const skip = (page - 1) * limit;

    const where: Prisma.CRMContactWhereInput = {
      tenantId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.accountId && { accountId: filters.accountId }),
      ...(filters?.search && {
        OR: [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [contacts, total] = await Promise.all([
      prisma.cRMContact.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [pagination?.sortBy || 'createdAt']: pagination?.sortOrder || 'desc',
        },
        include: { account: true },
      }),
      prisma.cRMContact.count({ where }),
    ]);

    return {
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateContactInput): Promise<CRMContact> {
    return prisma.cRMContact.update({
      where: { id },
      data: {
        ...data,
        email: data.email?.toLowerCase(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cRMContact.delete({
      where: { id },
    });
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await prisma.cRMContact.deleteMany({
      where: { id: { in: ids } },
    });
    return result.count;
  }

  async findDuplicates(tenantId: string, email: string): Promise<CRMContact[]> {
    return prisma.cRMContact.findMany({
      where: {
        tenantId,
        email: email.toLowerCase(),
      },
    });
  }
}

export const contactRepository = new ContactRepository();
