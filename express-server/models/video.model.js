// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

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
          num: 'desc',
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

  async findById(id) {
    try {
      const num = BigInt(id);
      const video = await prisma.member_video.findUnique({
        where: { num },
        select: {
          num: true,
          subject: true,
          text: true,
          link: true,
          reg_date: true,
        },
      });
      return video;
    } catch (error) {
      console.error('Error finding video by id:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const video = await prisma.member_video.create({
        data: {
          subject: String(data.subject ?? '').slice(0, 128),
          text: data.text != null ? String(data.text) : null,
          link: data.link != null && data.link !== '' ? String(data.link).slice(0, 255) : null,
        },
      });
      return video;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const num = BigInt(id);
      const updateData = {};
      if (data.subject !== undefined) updateData.subject = String(data.subject).slice(0, 128);
      if (data.text !== undefined) updateData.text = data.text != null ? String(data.text) : null;
      if (data.link !== undefined) updateData.link = data.link != null && data.link !== '' ? String(data.link).slice(0, 255) : null;
      const video = await prisma.member_video.update({
        where: { num },
        data: updateData,
      });
      return video;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const num = BigInt(id);
      await prisma.member_video.delete({ where: { num } });
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },
};