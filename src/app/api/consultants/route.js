import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 5;

    const consultants = await prisma.consultants.findMany({
      select: {
        num: true,
        name: true,
        profile: true,
        position: true,
        file_name1: true,
        original_file_name: true,
        order_num: true,
        reg_date: true,
      },
      skip,
      take,
      orderBy: { order_num: 'asc' },
    });

    const total = await prisma.consultants.count();
    const serializedConsultants = serializeBigInt(consultants);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serializedConsultants,
      total: serializedTotal,
      skip,
      take,
    });
  } catch (error) {
    console.error('Error in GET /api/consultants:', error);
    return Response.json(
      {
        success: false,
        message: '상임고문 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const order_num = body.order_num != null ? Number(body.order_num) : 0;
    const name = body.name != null ? String(body.name).slice(0, 255) : null;
    const profile = String(body.profile ?? '');
    const position = String(body.position ?? '');
    const file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 512) : null;
    const original_file_name = body.originalFileName != null && body.originalFileName !== '' ? String(body.originalFileName).slice(0, 512) : null;

    const consultant = await prisma.consultants.create({
      data: {
        order_num: BigInt(order_num),
        name,
        profile,
        position,
        file_name1,
        original_file_name,
      },
    });

    return Response.json({ success: true, data: serializeBigInt(consultant) }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/consultants:', error);
    return Response.json(
      { success: false, message: '상임고문 등록 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
