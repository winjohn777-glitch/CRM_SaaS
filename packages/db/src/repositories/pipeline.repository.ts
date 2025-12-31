import { prisma } from '../client';
import type { CRMPipeline, CRMPipelineStage, PipelineType, Prisma } from '@prisma/client';

export interface CreatePipelineInput {
  tenantId: string;
  name: string;
  description?: string;
  pipelineType: PipelineType;
  isDefault?: boolean;
  sourceConfigId?: string;
}

export interface CreateStageInput {
  pipelineId: string;
  name: string;
  description?: string;
  sortOrder: number;
  color?: string;
  probability?: number;
  isInitial?: boolean;
  isFinal?: boolean;
  isWon?: boolean;
  isLost?: boolean;
  autoActions?: Prisma.InputJsonValue;
  requiredFields?: string[];
}

export interface UpdatePipelineInput {
  name?: string;
  description?: string;
  isDefault?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateStageInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  color?: string;
  probability?: number;
  isInitial?: boolean;
  isFinal?: boolean;
  isWon?: boolean;
  isLost?: boolean;
  autoActions?: Prisma.InputJsonValue;
  requiredFields?: string[];
}

export class PipelineRepository {
  async create(data: CreatePipelineInput): Promise<CRMPipeline> {
    // If setting as default, unset other defaults first
    if (data.isDefault) {
      await prisma.cRMPipeline.updateMany({
        where: { tenantId: data.tenantId, pipelineType: data.pipelineType },
        data: { isDefault: false },
      });
    }

    return prisma.cRMPipeline.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        pipelineType: data.pipelineType,
        isDefault: data.isDefault || false,
        sourceConfigId: data.sourceConfigId,
      },
      include: { stages: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async createWithStages(
    pipelineData: CreatePipelineInput,
    stages: Omit<CreateStageInput, 'pipelineId'>[]
  ): Promise<CRMPipeline> {
    // If setting as default, unset other defaults first
    if (pipelineData.isDefault) {
      await prisma.cRMPipeline.updateMany({
        where: { tenantId: pipelineData.tenantId, pipelineType: pipelineData.pipelineType },
        data: { isDefault: false },
      });
    }

    return prisma.cRMPipeline.create({
      data: {
        tenantId: pipelineData.tenantId,
        name: pipelineData.name,
        description: pipelineData.description,
        pipelineType: pipelineData.pipelineType,
        isDefault: pipelineData.isDefault || false,
        sourceConfigId: pipelineData.sourceConfigId,
        stages: {
          create: stages.map((stage) => ({
            name: stage.name,
            description: stage.description,
            sortOrder: stage.sortOrder,
            color: stage.color,
            probability: stage.probability,
            isInitial: stage.isInitial || false,
            isFinal: stage.isFinal || false,
            isWon: stage.isWon || false,
            isLost: stage.isLost || false,
            autoActions: stage.autoActions,
            requiredFields: stage.requiredFields || [],
          })),
        },
      },
      include: { stages: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findById(id: string): Promise<CRMPipeline | null> {
    return prisma.cRMPipeline.findUnique({
      where: { id },
      include: {
        stages: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { opportunities: true } },
      },
    });
  }

  async findByTenant(tenantId: string, pipelineType?: PipelineType): Promise<CRMPipeline[]> {
    return prisma.cRMPipeline.findMany({
      where: {
        tenantId,
        isActive: true,
        ...(pipelineType && { pipelineType }),
      },
      include: {
        stages: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { opportunities: true } },
      },
      orderBy: [{ isDefault: 'desc' }, { sortOrder: 'asc' }],
    });
  }

  async findDefault(tenantId: string, pipelineType: PipelineType): Promise<CRMPipeline | null> {
    return prisma.cRMPipeline.findFirst({
      where: { tenantId, pipelineType, isDefault: true, isActive: true },
      include: { stages: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async update(id: string, data: UpdatePipelineInput): Promise<CRMPipeline> {
    const pipeline = await prisma.cRMPipeline.findUnique({ where: { id } });
    if (!pipeline) throw new Error('Pipeline not found');

    // If setting as default, unset other defaults first
    if (data.isDefault) {
      await prisma.cRMPipeline.updateMany({
        where: {
          tenantId: pipeline.tenantId,
          pipelineType: pipeline.pipelineType,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    return prisma.cRMPipeline.update({
      where: { id },
      data,
      include: { stages: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async delete(id: string): Promise<void> {
    // Check if pipeline has opportunities
    const count = await prisma.cRMOpportunity.count({ where: { pipelineId: id } });
    if (count > 0) {
      throw new Error('Cannot delete pipeline with existing opportunities');
    }

    await prisma.cRMPipeline.delete({ where: { id } });
  }

  // Stage operations
  async addStage(data: CreateStageInput): Promise<CRMPipelineStage> {
    return prisma.cRMPipelineStage.create({
      data: {
        pipelineId: data.pipelineId,
        name: data.name,
        description: data.description,
        sortOrder: data.sortOrder,
        color: data.color,
        probability: data.probability,
        isInitial: data.isInitial || false,
        isFinal: data.isFinal || false,
        isWon: data.isWon || false,
        isLost: data.isLost || false,
        autoActions: data.autoActions,
        requiredFields: data.requiredFields || [],
      },
    });
  }

  async updateStage(id: string, data: UpdateStageInput): Promise<CRMPipelineStage> {
    return prisma.cRMPipelineStage.update({
      where: { id },
      data,
    });
  }

  async deleteStage(id: string): Promise<void> {
    // Check if stage has opportunities
    const count = await prisma.cRMOpportunity.count({ where: { stageId: id } });
    if (count > 0) {
      throw new Error('Cannot delete stage with existing opportunities');
    }

    await prisma.cRMPipelineStage.delete({ where: { id } });
  }

  async reorderStages(pipelineId: string, stageIds: string[]): Promise<void> {
    await prisma.$transaction(
      stageIds.map((stageId, index) =>
        prisma.cRMPipelineStage.update({
          where: { id: stageId },
          data: { sortOrder: index + 1 },
        })
      )
    );
  }
}

export const pipelineRepository = new PipelineRepository();
