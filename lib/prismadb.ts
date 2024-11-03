import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Manejo de errores
// prisma.$use(async (params, next) => {
//   try {
//     return await next(params);
//   } catch (error) {
//     console.error(error);
//     throw error; // Propaga el error
//   }
// });

// export default prisma;
