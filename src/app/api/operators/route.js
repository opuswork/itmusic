import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    console.log('Fetching operators...');
    
    const operators = await prisma.opr_mem.findMany({
      select: {
        num: true,
        name: true,
        profile: true,
        position: true,
        file_name1: true,
        order_num: true,
      },
      orderBy: {
        order_num: 'asc',
      },
    });

    console.log('Successfully fetched', operators.length, 'operators');

    const serializedOperators = serializeBigInt(operators);

    return Response.json({
      success: true,
      data: serializedOperators,
    });
  } catch (error) {
    console.error('Error in GET /api/operators:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '이사진 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
