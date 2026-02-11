// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 10) {
    try {
      const competitions = await prisma.events.findMany({
        select: {
          num: true,
          subject: true,
          category: true,
          content: true,
          event_start_date: true,
          event_end_date: true,
          location: true,
          operator: true,
          planner: true,
          reg_date: true,
          supporter: true,
          visit: true,
          file_name1: true,
          file_name2: true,
          file_name3: true,
        },
        skip: skip,
        take: take,
        orderBy: {
          order_num: 'desc',
        },
      });
      return competitions;
    } catch (error) {
      console.error('Error fetching competitions:', error);
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
      const count = await prisma.events.count();
      return count;
    } catch (error) {
      console.error('Error counting competitions:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};
