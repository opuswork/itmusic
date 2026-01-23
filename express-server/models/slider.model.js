// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll() {
    try {
      const sliders = await prisma.slider.findMany({
        where: {
          display: 1,
        },
        select: {
          num: true,
          file_name1: true,
          link: true,
          order_num: true,
        },
        orderBy: {
          order_num: 'desc',
        },
      });
      return sliders;
    } catch (error) {
      console.error('Error fetching sliders:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};
