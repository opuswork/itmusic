import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 5;

    const directors = await prisma.itmusic_director.findMany({
      select: {
        num: true,
        name: true,
        position: true,
        text: true,
        file_name1: true,
        original_file_name: true,
        reg_date: true,
      },
      skip,
      take,
      orderBy: { num: 'asc' },
    });

    const total = await prisma.itmusic_director.count();
    const serializedDirectors = serializeBigInt(directors);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedDirectors,
      total: serializedTotal,
      skip,
      take,
    });
  } catch (error) {
    console.error('Error in GET /api/directors:', error);
    return Response.json(
      {
        success: false,
        message: '음악감독 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').slice(0, 128);
    const position = String(body.position ?? '').slice(0, 128);
    const text = body.text != null && body.text !== '' ? String(body.text) : null;
    const file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 512) : null;
    const original_file_name = body.originalFileName != null && body.originalFileName !== '' ? String(body.originalFileName).slice(0, 512) : null;

    const maxRow = await prisma.itmusic_director.findFirst({
      orderBy: { num: 'desc' },
      select: { num: true },
    });
    const nextNum = maxRow ? maxRow.num + BigInt(1) : BigInt(1);

    const director = await prisma.itmusic_director.create({
      data: {
        num: nextNum,
        name,
        position,
        text,
        file_name1,
        original_file_name,
      },
    });

    return Response.json({ success: true, data: serializeBigInt(director) }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/directors:', error);
    return Response.json(
      { success: false, message: '음악감독 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
