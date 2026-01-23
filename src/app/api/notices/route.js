import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching notices with skip:', skip, 'take:', take);
    
    const notices = await prisma.notice.findMany({
      select: {
        num: true,
        subject: true,
        content: true,
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

    const total = await prisma.notice.count();

    console.log('Successfully fetched', notices.length, 'notices out of', total);

    const serializedNotices = serializeBigInt(notices);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedNotices,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/notices:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '공지사항 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
