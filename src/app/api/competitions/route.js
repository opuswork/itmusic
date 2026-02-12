import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    console.log('Fetching competitions with skip:', skip, 'take:', take);
    
    const competitions = await prisma.events.findMany({
      select: {
        num: true,
        order_num: true,
        subject: true,
        category: true,
        content: true,
        event_start_date: true,
        event_end_date: true,
        location: true,
        operator: true,
        planner: true,
        reg_date: true,
        supporter: true,
        visit: true,
        file_name1: true,
        file_name2: true,
        file_name3: true,
        original_file_name1: true,
        original_file_name2: true,
        original_file_name3: true,
      },
      skip: skip,
      take: take,
      orderBy: { num: 'desc' },
    });

    const total = await prisma.events.count();

    console.log('Successfully fetched', competitions.length, 'competitions out of', total);

    const serializedCompetitions = serializeBigInt(competitions);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedCompetitions,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/competitions:', error);
    return Response.json(
      { success: false, message: '콩쿠르 데이터를 불러오는 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const order_num = body.order_num != null ? Number(body.order_num) : 0;
    const category = body.category != null && body.category !== '' ? String(body.category).slice(0, 255) : null;
    const subject = String(body.subject ?? '').slice(0, 128);
    const content = body.content != null ? String(body.content) : null;
    const location = String(body.location ?? '다큐홀').slice(0, 255);
    const operator = String(body.operator ?? '이탈리아음악협회').slice(0, 100);
    const planner = String(body.planner ?? '이탈리아음악협회').slice(0, 100);
    const supporter = String(body.supporter ?? '이탈리아음악협회').slice(0, 255);
    const event_start_date = body.event_start_date ? new Date(body.event_start_date) : null;
    const event_end_date = body.event_end_date ? new Date(body.event_end_date) : null;
    const str = (v) => (v != null && v !== '' ? String(v).slice(0, 512) : null);
    const file_name1 = str(body.file_name1);
    const file_name2 = str(body.file_name2);
    const file_name3 = str(body.file_name3);
    const original_file_name1 = str(body.originalFileName1);
    const original_file_name2 = str(body.originalFileName2);
    const original_file_name3 = str(body.originalFileName3);

    const competition = await prisma.events.create({
      data: {
        order_num: BigInt(order_num),
        category,
        subject,
        content: content ?? '',
        location,
        operator,
        planner,
        supporter,
        event_start_date,
        event_end_date,
        file_name1,
        file_name2,
        file_name3,
        original_file_name1,
        original_file_name2,
        original_file_name3,
      },
    });

    return Response.json({ success: true, data: serializeBigInt(competition) }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/competitions:', error);
    return Response.json(
      { success: false, message: '콩쿠르 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
