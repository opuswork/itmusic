// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll() {
    try {
      const directors = await prisma.itmusic_director.findMany({
        select: {
          num: true,
          name: true,
          position: true,
          text: true,
          file_name1: true,
        },
        orderBy: {
          num: 'asc',
        },
      });
      return directors;
    } catch (error) {
      console.error('Error fetching directors:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};