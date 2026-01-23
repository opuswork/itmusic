import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching videos with skip:', skip, 'take:', take);
    
    const videos = await prisma.member_video.findMany({
      select: {
        num: true,
        subject: true,
        text: true,
        link: true,
        reg_date: true,
      },
      skip: skip,
      take: take,
      orderBy: {
        num: 'asc',
      },
    });

    const total = await prisma.member_video.count();

    console.log('Successfully fetched', videos.length, 'videos out of', total);

    const serializedVideos = serializeBigInt(videos);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedVideos,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '영상 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
