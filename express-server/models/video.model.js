// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 10) {
    try {
      console.log('Attempting to fetch videos from database...');
      const videos = await prisma.member_video.findMany({
        select: {
          num: true,
          subject: true,
          text: true,
          link: true,
          reg_date: true,
        },
        skip: skip,
        take: take,
        orderBy: {
          num: 'asc',
        },
      });
      console.log('Successfully fetched', videos.length, 'videos');
      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
      });
      throw error;
    }
  },
  
  async count() {
    try {
      const count = await prisma.member_video.count();
      return count;
    } catch (error) {
      console.error('Error counting videos:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      throw error;
    }
  },
};