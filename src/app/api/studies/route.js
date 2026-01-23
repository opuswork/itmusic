import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching studies with skip:', skip, 'take:', take);
    
    const studies = await prisma.study_abroad.findMany({
      select: {
        num: true,
        subject: true,
        content: true,
        reg_date: true,
        visit: true,
        file_name1: true,
        file_name2: true,
        file_name3: true,
      },
      skip: skip,
      take: take,
      orderBy: {
        num: 'desc',
      },
    });

    const total = await prisma.study_abroad.count();

    console.log('Successfully fetched', studies.length, 'studies out of', total);

    const serializedStudies = serializeBigInt(studies);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedStudies,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/studies:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '유학정보 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
