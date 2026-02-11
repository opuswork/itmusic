import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching sliders with skip:', skip, 'take:', take);
    
    const sliders = await prisma.slider.findMany({
      select: {
        num: true,
        subject: true,
        file_name1: true,
        original_file_name: true,
        link: true,
        reg_date: true,
        order_num: true,
        display: true,
      },
      skip: skip,
      take: take,
      orderBy: {
        num: 'desc',
      },
    });

    const total = await prisma.slider.count();

    console.log('Successfully fetched', sliders.length, 'sliders out of', total);

    const serializedSliders = serializeBigInt(sliders);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedSliders,
      total: serializedTotal,
      skip: skip,
      take: take,
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject = '', link = null, file_name1 = null, originalFileName = null } = body;

    const slider = await prisma.slider.create({
      data: {
        subject: String(subject).slice(0, 128),
        link: link != null && link !== '' ? String(link).slice(0, 255) : null,
        file_name1: file_name1 != null ? String(file_name1).slice(0, 512) : null,
        original_file_name: originalFileName != null ? String(originalFileName).slice(0, 255) : null,
        order_num: BigInt(0),
        display: 1,
        reg_date: new Date(),
      },
    });

    const serialized = serializeBigInt(slider);
    return Response.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Error in POST /api/sliders:', error);
    return Response.json(
      { success: false, message: '슬라이더 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
