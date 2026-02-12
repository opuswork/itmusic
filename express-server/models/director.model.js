// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export default {
  async findAll(skip = 0, take = 5) {
    try {
      const directors = await prisma.itmusic_director.findMany({
        select: {
          num: true,
          name: true,
          position: true,
          text: true,
          file_name1: true,
          original_file_name: true,
          reg_date: true,
        },
        skip: skip,
        take: take,
        orderBy: {
          num: 'asc',
        },
      });
      return directors;
    } catch (error) {
      console.error('Error fetching directors:', error);
      throw error;
    }
  },

  async count() {
    try {
      return await prisma.itmusic_director.count();
    } catch (error) {
      console.error('Error counting directors:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const num = BigInt(id);
      const director = await prisma.itmusic_director.findUnique({
        where: { num },
      });
      return director;
    } catch (error) {
      console.error('Error finding director by id:', error);
      throw error;
    }
  },

  async getNextNum() {
    try {
      const result = await prisma.itmusic_director.findFirst({
        orderBy: { num: 'desc' },
        select: { num: true },
      });
      return result ? result.num + BigInt(1) : BigInt(1);
    } catch (error) {
      console.error('Error getting next director num:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const num = data.num != null ? BigInt(data.num) : await this.getNextNum();
      const director = await prisma.itmusic_director.create({
        data: {
          num,
          name: String(data.name ?? '').slice(0, 128),
          position: String(data.position ?? '').slice(0, 128),
          text: data.text != null && data.text !== '' ? String(data.text) : null,
          file_name1: data.file_name1 != null && data.file_name1 !== '' ? String(data.file_name1).slice(0, 512) : null,
          original_file_name: data.original_file_name != null && data.original_file_name !== '' ? String(data.original_file_name).slice(0, 512) : null,
        },
      });
      return director;
    } catch (error) {
      console.error('Error creating director:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const num = BigInt(id);
      const updateData = {};
      if (data.name !== undefined) updateData.name = String(data.name ?? '').slice(0, 128);
      if (data.position !== undefined) updateData.position = String(data.position ?? '').slice(0, 128);
      if (data.text !== undefined) updateData.text = data.text != null && data.text !== '' ? String(data.text) : null;
      if (data.file_name1 !== undefined) updateData.file_name1 = data.file_name1 != null && data.file_name1 !== '' ? String(data.file_name1).slice(0, 512) : null;
      if (data.original_file_name !== undefined) updateData.original_file_name = data.original_file_name != null && data.original_file_name !== '' ? String(data.original_file_name).slice(0, 512) : null;
      const director = await prisma.itmusic_director.update({
        where: { num },
        data: updateData,
      });
      return director;
    } catch (error) {
      console.error('Error updating director:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const num = BigInt(id);
      await prisma.itmusic_director.delete({ where: { num } });
    } catch (error) {
      console.error('Error deleting director:', error);
      throw error;
    }
  },
};
