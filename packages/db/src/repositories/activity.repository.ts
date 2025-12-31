import { prisma } from '../client';
import type { CRMActivity, ActivityStatus, Prisma } from '@prisma/client';

export interface CreateActivityInput {
  tenantId: string;
  activityTypeKey: string;
  subject: string;
  description?: string;
  scheduledAt?: Date;
  dueAt?: Date;
  durationMinutes?: number;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  assignedToId?: string;
  createdById?: string;
  priority?: number;
  customFields?: Prisma.InputJsonValue;
}

export interface UpdateActivityInput {
  activityTypeKey?: string;
  subject?: string;
  description?: string;
  scheduledAt?: Date;
  dueAt?: Date;
  completedAt?: Date;
  durationMinutes?: number;
  locationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  assignedToId?: string;
  status?: ActivityStatus;
  priority?: number;
  customFields?: Prisma.InputJsonValue;
}

export interface ActivityFilters {
  activityTypeKey?: string;
  status?: ActivityStatus;
  assignedToId?: string;
  contactId?: string;
  accountId?: string;
  opportunityId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ActivityRepository {
  async create(data: CreateActivityInput): Promise<CRMActivity> {
    return prisma.cRMActivity.create({
      data: {
        tenantId: data.tenantId,
        activityTypeKey: data.activityTypeKey,
        subject: data.subject,
        description: data.description,
        scheduledAt: data.scheduledAt,
        dueAt: data.dueAt,
        durationMinutes: data.durationMinutes,
        locationName: data.locationName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        contactId: data.contactId,
        accountId: data.accountId,
        opportunityId: data.opportunityId,
        assignedToId: data.assignedToId,
        createdById: data.createdById,
        priority: data.priority || 0,
        customFields: data.customFields || {},
      },
      include: {
        contact: true,
        account: true,
        opportunity: true,
        assignedTo: true,
        createdBy: true,
      },
    });
  }

  async findById(id: string): Promise<CRMActivity | null> {
    return prisma.cRMActivity.findUnique({
      where: { id },
      include: {
        contact: true,
        account: true,
        opportunity: true,
        assignedTo: true,
        createdBy: true,
      },
    });
  }

  async findByTenant(
    tenantId: string,
    filters?: ActivityFilters,
    pagination?: PaginationOptions
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 25;
    const skip = (page - 1) * limit;

    const where: Prisma.CRMActivityWhereInput = {
      tenantId,
      ...(filters?.activityTypeKey && { activityTypeKey: filters.activityTypeKey }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      ...(filters?.contactId && { contactId: filters.contactId }),
      ...(filters?.accountId && { accountId: filters.accountId }),
      ...(filters?.opportunityId && { opportunityId: filters.opportunityId }),
      ...(filters?.dateFrom && {
        scheduledAt: { gte: filters.dateFrom },
      }),
      ...(filters?.dateTo && {
        scheduledAt: { lte: filters.dateTo },
      }),
    };

    const [activities, total] = await Promise.all([
      prisma.cRMActivity.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [pagination?.sortBy || 'scheduledAt']: pagination?.sortOrder || 'asc',
        },
        include: {
          contact: true,
          account: true,
          opportunity: true,
          assignedTo: true,
        },
      }),
      prisma.cRMActivity.count({ where }),
    ]);

    return {
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUpcoming(tenantId: string, userId?: string, days: number = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.cRMActivity.findMany({
      where: {
        tenantId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        scheduledAt: {
          gte: now,
          lte: futureDate,
        },
        ...(userId && { assignedToId: userId }),
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        contact: true,
        account: true,
        opportunity: true,
      },
    });
  }

  async findOverdue(tenantId: string, userId?: string) {
    const now = new Date();

    return prisma.cRMActivity.findMany({
      where: {
        tenantId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        dueAt: { lt: now },
        ...(userId && { assignedToId: userId }),
      },
      orderBy: { dueAt: 'asc' },
      include: {
        contact: true,
        account: true,
        opportunity: true,
      },
    });
  }

  async update(id: string, data: UpdateActivityInput): Promise<CRMActivity> {
    return prisma.cRMActivity.update({
      where: { id },
      data,
      include: {
        contact: true,
        account: true,
        opportunity: true,
        assignedTo: true,
      },
    });
  }

  async complete(id: string): Promise<CRMActivity> {
    return prisma.cRMActivity.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  async cancel(id: string): Promise<CRMActivity> {
    return prisma.cRMActivity.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cRMActivity.delete({
      where: { id },
    });
  }

  async getCalendarView(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ) {
    return prisma.cRMActivity.findMany({
      where: {
        tenantId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
        ...(userId && { assignedToId: userId }),
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        contact: true,
        account: true,
        opportunity: true,
      },
    });
  }
}

export const activityRepository = new ActivityRepository();
