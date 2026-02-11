// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll() {
    try {
      const operators = await prisma.opr_mem.findMany({
        select: {
          num: true,
          name: true,
          profile: true,
          position: true,
          file_name1: true,
          order_num: true,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      return operators;
    } catch (error) {
      console.error('Error fetching operators:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};