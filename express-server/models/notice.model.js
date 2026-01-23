// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 10) {
    try {
      const notices = await prisma.notice.findMany({
        select: {
          num: true,
          subject: true,
          content: true,
          reg_date: true,
          visit: true,
          file_name1: true,
        },
        skip: skip,
        take: take,
        orderBy: {
          num: 'desc',
        },
      });
      return notices;
    } catch (error) {
      console.error('Error fetching notices:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
  
  async count() {
    try {
      const count = await prisma.notice.count();
      return count;
    } catch (error) {
      console.error('Error counting notices:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};