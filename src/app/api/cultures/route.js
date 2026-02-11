import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { subject = '', content = null, category = null } = body;

    const culture = await prisma.italy_culture.create({
      data: {
        user_name: 'admin',
        user_pwd: '',
        user_ip: '0.0.0.0',
        subject: String(subject).slice(0, 128),
        content: content != null ? String(content) : null,
        category: category != null ? String(category).slice(0, 255) : null,
        file_name1: '1',
        file_name2: 'none',
        file_name3: 'none',
      },
    });

    const serialized = serializeBigInt(culture);
    return Response.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Error in POST /api/cultures:', error);
    return Response.json(
      { success: false, message: '문화 게시물 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching cultures with skip:', skip, 'take:', take);
    
    const cultures = await prisma.italy_culture.findMany({
      select: {
        num: true,
        subject: true,
        content: true,
        category: true,
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

    const total = await prisma.italy_culture.count();

    console.log('Successfully fetched', cultures.length, 'cultures out of', total);

    const serializedCultures = serializeBigInt(cultures);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedCultures,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/cultures:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '문화 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
