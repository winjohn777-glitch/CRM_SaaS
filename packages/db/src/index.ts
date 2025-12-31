// Re-export Prisma client
export { prisma, PrismaClient } from './client';
export type { Prisma } from './client';

// Re-export all generated types
export * from '@prisma/client';

// Repository exports will be added here
export * from './repositories';
