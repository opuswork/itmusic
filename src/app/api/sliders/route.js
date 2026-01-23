import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        display: 1,
      },
      select: {
        num: true,
        file_name1: true,
        link: true,
        order_num: true,
      },
      orderBy: {
        order_num: 'desc',
      },
    });

    const serializedSliders = serializeBigInt(sliders);

    return Response.json({
      success: true,
      data: serializedSliders,
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      name: error.name,
    });
    
    // 데이터베이스 연결 확인
    if (error.code === 'P1001' || error.message?.includes('connect')) {
      console.error('Database connection error - DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    }
    
    return Response.json(
      {
        success: false,
        message: '슬라이더 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
