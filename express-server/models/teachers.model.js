// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 5) {
    try {
      const teachers = await prisma.teachers.findMany({
        select: {
          num: true,
          name: true,
          profile: true,
          position: true,
          file_name1: true,
          order_num: true,
        },
        skip: skip,
        take: take,
        orderBy: {
          order_num: 'asc',
        },
      });
      return teachers;
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
      const count = await prisma.teachers.count();
      return count;
    } catch (error) {
      console.error('Error counting teachers:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};