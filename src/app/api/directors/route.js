import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    console.log('Fetching directors...');
    
    const directors = await prisma.itmusic_director.findMany({
      select: {
        num: true,
        name: true,
        position: true,
        text: true,
        file_name1: true,
      },
      orderBy: {
        num: 'asc',
      },
    });

    console.log('Successfully fetched', directors.length, 'directors');

    const serializedDirectors = serializeBigInt(directors);

    return Response.json({
      success: true,
      data: serializedDirectors,
    });
  } catch (error) {
    console.error('Error in GET /api/directors:', error);
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
