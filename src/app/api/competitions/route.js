import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching competitions with skip:', skip, 'take:', take);
    
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
        num: 'desc',
      },
    });

    const total = await prisma.events.count();

    console.log('Successfully fetched', competitions.length, 'competitions out of', total);

    const serializedCompetitions = serializeBigInt(competitions);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedCompetitions,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/competitions:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '콩쿠르 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
