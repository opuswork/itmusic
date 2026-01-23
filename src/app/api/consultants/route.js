import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 5;

    console.log('Fetching consultants with skip:', skip, 'take:', take);
    
    const consultants = await prisma.consultants.findMany({
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

    const total = await prisma.consultants.count();

    console.log('Successfully fetched', consultants.length, 'consultants out of', total);

    const serializedConsultants = serializeBigInt(consultants);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedConsultants,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/consultants:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '상임고문 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
