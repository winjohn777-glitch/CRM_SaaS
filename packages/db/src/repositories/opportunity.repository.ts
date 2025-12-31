import { prisma } from '../client';
import type { CRMOpportunity, OpportunityStatus, Prisma } from '@prisma/client';

export interface CreateOpportunityInput {
  tenantId: string;
  name: string;
  description?: string;
  amount?: number;
  probability?: number;
  expectedCloseDate?: Date;
  pipelineId: string;
  stageId: string;
  accountId?: string;
  primaryContactId?: string;
  assignedToId?: string;
  customFields?: Prisma.InputJsonValue;
}

export interface UpdateOpportunityInput {
  name?: string;
  description?: string;
  amount?: number;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  stageId?: string;
  accountId?: string;
  primaryContactId?: string;
  assignedToId?: string;
  status?: OpportunityStatus;
  lostReason?: string;
  wonReason?: string;
  customFields?: Prisma.InputJsonValue;
}

export interface OpportunityFilters {
  pipelineId?: string;
  stageId?: string;
  status?: OpportunityStatus;
  assignedToId?: string;
  accountId?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  closeDateFrom?: Date;
  closeDateTo?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class OpportunityRepository {
  async create(data: CreateOpportunityInput): Promise<CRMOpportunity> {
    return prisma.cRMOpportunity.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        amount: data.amount,
        probability: data.probability || 0,
        expectedCloseDate: data.expectedCloseDate,
        pipelineId: data.pipelineId,
        stageId: data.stageId,
        accountId: data.accountId,
        primaryContactId: data.primaryContactId,
        assignedToId: data.assignedToId,
        customFields: data.customFields || {},
      },
      include: {
        pipeline: true,
        stage: true,
        account: true,
        primaryContact: true,
        assignedTo: true,
      },
    });
  }

  async findById(id: string): Promise<CRMOpportunity | null> {
    return prisma.cRMOpportunity.findUnique({
      where: { id },
      include: {
        pipeline: true,
        stage: true,
        account: true,
        primaryContact: true,
        assignedTo: true,
        activities: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async findByTenant(
    tenantId: string,
    filters?: OpportunityFilters,
    pagination?: PaginationOptions
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 25;
    const skip = (page - 1) * limit;

    const where: Prisma.CRMOpportunityWhereInput = {
      tenantId,
      ...(filters?.pipelineId && { pipelineId: filters.pipelineId }),
      ...(filters?.stageId && { stageId: filters.stageId }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      ...(filters?.accountId && { accountId: filters.accountId }),
      ...(filters?.search && {
        name: { contains: filters.search, mode: 'insensitive' },
      }),
      ...(filters?.minAmount && { amount: { gte: filters.minAmount } }),
      ...(filters?.maxAmount && { amount: { lte: filters.maxAmount } }),
      ...(filters?.closeDateFrom && {
        expectedCloseDate: { gte: filters.closeDateFrom },
      }),
      ...(filters?.closeDateTo && {
        expectedCloseDate: { lte: filters.closeDateTo },
      }),
    };

    const [opportunities, total] = await Promise.all([
      prisma.cRMOpportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [pagination?.sortBy || 'createdAt']: pagination?.sortOrder || 'desc',
        },
        include: {
          pipeline: true,
          stage: true,
          account: true,
          primaryContact: true,
          assignedTo: true,
        },
      }),
      prisma.cRMOpportunity.count({ where }),
    ]);

    return {
      data: opportunities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByPipeline(tenantId: string, pipelineId: string) {
    return prisma.cRMOpportunity.findMany({
      where: { tenantId, pipelineId, status: 'OPEN' },
      include: {
        stage: true,
        account: true,
        primaryContact: true,
        assignedTo: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: UpdateOpportunityInput): Promise<CRMOpportunity> {
    return prisma.cRMOpportunity.update({
      where: { id },
      data,
      include: {
        pipeline: true,
        stage: true,
        account: true,
        primaryContact: true,
        assignedTo: true,
      },
    });
  }

  async moveToStage(id: string, stageId: string, probability?: number): Promise<CRMOpportunity> {
    return prisma.cRMOpportunity.update({
      where: { id },
      data: {
        stageId,
        ...(probability !== undefined && { probability }),
      },
      include: {
        pipeline: true,
        stage: true,
      },
    });
  }

  async markWon(id: string, wonReason?: string): Promise<CRMOpportunity> {
    return prisma.cRMOpportunity.update({
      where: { id },
      data: {
        status: 'WON',
        actualCloseDate: new Date(),
        probability: 100,
        wonReason,
      },
    });
  }

  async markLost(id: string, lostReason?: string): Promise<CRMOpportunity> {
    return prisma.cRMOpportunity.update({
      where: { id },
      data: {
        status: 'LOST',
        actualCloseDate: new Date(),
        probability: 0,
        lostReason,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cRMOpportunity.delete({
      where: { id },
    });
  }

  async getPipelineStats(tenantId: string, pipelineId: string) {
    const stages = await prisma.cRMPipelineStage.findMany({
      where: { pipelineId },
      orderBy: { sortOrder: 'asc' },
    });

    const stats = await Promise.all(
      stages.map(async (stage) => {
        const [count, total] = await Promise.all([
          prisma.cRMOpportunity.count({
            where: { tenantId, pipelineId, stageId: stage.id, status: 'OPEN' },
          }),
          prisma.cRMOpportunity.aggregate({
            where: { tenantId, pipelineId, stageId: stage.id, status: 'OPEN' },
            _sum: { amount: true },
          }),
        ]);
        return {
          stageId: stage.id,
          stageName: stage.name,
          count,
          totalValue: total._sum.amount || 0,
        };
      })
    );

    return stats;
  }
}

export const opportunityRepository = new OpportunityRepository();
