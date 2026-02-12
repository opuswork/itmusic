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
        category: true,
        reg_date: true,
        visit: true,
        file_name1: true,
        original_file_name: true,
        category: true,
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
    return Response.json(
      {
        success: false,
        message: '공지사항 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const subject = String(body.subject ?? '').slice(0, 128);
    const content = body.content != null ? String(body.content) : null;
    const category = body.category != null && body.category !== '' ? String(body.category).slice(0, 255) : null;
    const file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 512) : null;
    const original_file_name = body.originalFileName != null && body.originalFileName !== '' ? String(body.originalFileName).slice(0, 512) : null;

    const notice = await prisma.notice.create({
      data: {
        user_name: '',
        user_pwd: '',
        subject,
        content: content ?? '',
        category,
        file_name1,
        original_file_name,
      },
    });

    return Response.json({ success: true, data: serializeBigInt(notice) }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/notices:', error);
    return Response.json(
      { success: false, message: '공지사항 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
