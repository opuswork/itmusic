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
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return Response.json(
      {
        success: false,
        message: '슬라이더 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
