import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function POST(request) {
  try {
    const body = await request.json();
    const order_num = body.order_num != null ? Number(body.order_num) : 0;
    const name = body.name != null ? String(body.name).slice(0, 255) : null;
    const profile = String(body.profile ?? '');
    const position = String(body.position ?? '');
    const file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 100) : null;

    const executive = await prisma.board_trustee.create({
      data: {
        order_num: BigInt(order_num),
        name,
        profile,
        position,
        file_name1,
      },
    });

    const serialized = serializeBigInt(executive);
    return Response.json({ success: true, data: serialized });
  } catch (error) {
    console.error('Error in POST /api/executives:', error);
    return Response.json(
      { success: false, message: '상임이사 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 5;

    console.log('Fetching executives with skip:', skip, 'take:', take);
    
    const executives = await prisma.board_trustee.findMany({
      select: {
        num: true,
        name: true,
        profile: true,
        position: true,
        file_name1: true,
        order_num: true,
      },
      skip: skip,
      take: take,
      orderBy: {
        order_num: 'asc',
      },
    });

    const total = await prisma.board_trustee.count();

    console.log('Successfully fetched', executives.length, 'executives out of', total);

    const serializedExecutives = serializeBigInt(executives);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedExecutives,
      total: serializedTotal,
      skip: skip,
      take: take,
    });
  } catch (error) {
    console.error('Error in GET /api/executives:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      {
        success: false,
        message: '상임이사 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
