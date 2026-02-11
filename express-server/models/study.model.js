// Prisma, postgres 연동 로직, 데이터 스키마 정의
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Model은 데이터를 접근하는 레이어
export default {
  async findAll(skip = 0, take = 10) {
    try {
      const studies = await prisma.study_abroad.findMany({
        select: {
          num: true,
          subject: true,
          content: true,
          category: true,
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
      return studies;
    } catch (error) {
      console.error('Error fetching studies:', error);
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
      const count = await prisma.study_abroad.count();
      return count;
    } catch (error) {
      console.error('Error counting studies:', error);
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
      const study = await prisma.study_abroad.findUnique({
        where: { num },
        select: {
          num: true,
          subject: true,
          content: true,
          category: true,
          reg_date: true,
          visit: true,
          file_name1: true,
          file_name2: true,
          file_name3: true,
        },
      });
      return study;
    } catch (error) {
      console.error('Error finding study by id:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const study = await prisma.study_abroad.create({
        data: {
          user_name: String(data.user_name ?? 'admin').slice(0, 32),
          email: data.email != null ? String(data.email).slice(0, 64) : null,
          user_pwd: String(data.user_pwd ?? '').slice(0, 20),
          category: data.category != null ? String(data.category).slice(0, 255) : null,
          subject: String(data.subject ?? '').slice(0, 128),
          content: data.content != null ? String(data.content) : null,
          user_ip: String(data.user_ip ?? '0.0.0.0').slice(0, 16),
          file_name1: data.file_name1 != null ? String(data.file_name1).slice(0, 100) : '1',
          file_name2: data.file_name2 != null ? String(data.file_name2).slice(0, 100) : 'none',
          file_name3: data.file_name3 != null ? String(data.file_name3).slice(0, 100) : 'none',
        },
      });
      return study;
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const num = BigInt(id);
      const updateData = {};
      if (data.subject !== undefined) updateData.subject = String(data.subject).slice(0, 128);
      if (data.content !== undefined) updateData.content = data.content != null ? String(data.content) : null;
      if (data.category !== undefined) updateData.category = data.category != null ? String(data.category).slice(0, 255) : null;
      const study = await prisma.study_abroad.update({
        where: { num },
        data: updateData,
      });
      return study;
    } catch (error) {
      console.error('Error updating study:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const num = BigInt(id);
      await prisma.study_abroad.delete({ where: { num } });
    } catch (error) {
      console.error('Error deleting study:', error);
      throw error;
    }
  },
};