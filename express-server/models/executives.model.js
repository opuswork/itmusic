// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 5) {
    try {
      const executives = await prisma.board_trustee.findMany({
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
      return executives;
    } catch (error) {
      console.error('Error fetching executives:', error);
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
      const count = await prisma.board_trustee.count();
      return count;
    } catch (error) {
      console.error('Error counting executives:', error);
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
      const executive = await prisma.board_trustee.findUnique({
        where: { num },
      });
      return executive;
    } catch (error) {
      console.error('Error finding executive by id:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const order_num = data.order_num != null ? BigInt(data.order_num) : BigInt(0);
      const executive = await prisma.board_trustee.create({
        data: {
          order_num,
          name: data.name != null ? String(data.name).slice(0, 255) : null,
          profile: String(data.profile ?? ''),
          position: String(data.position ?? ''),
          file_name1: data.file_name1 != null && data.file_name1 !== '' ? String(data.file_name1).slice(0, 100) : null,
        },
      });
      return executive;
    } catch (error) {
      console.error('Error creating executive:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const num = BigInt(id);
      const updateData = {};
      if (data.order_num !== undefined) updateData.order_num = BigInt(data.order_num);
      if (data.name !== undefined) updateData.name = data.name != null ? String(data.name).slice(0, 255) : null;
      if (data.profile !== undefined) updateData.profile = String(data.profile);
      if (data.position !== undefined) updateData.position = String(data.position);
      if (data.file_name1 !== undefined) updateData.file_name1 = data.file_name1 != null && data.file_name1 !== '' ? String(data.file_name1).slice(0, 100) : null;
      const executive = await prisma.board_trustee.update({
        where: { num },
        data: updateData,
      });
      return executive;
    } catch (error) {
      console.error('Error updating executive:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const num = BigInt(id);
      await prisma.board_trustee.delete({ where: { num } });
    } catch (error) {
      console.error('Error deleting executive:', error);
      throw error;
    }
  },
};