import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const take = parseInt(searchParams.get('take')) || 10;

    const members = await prisma.members.findMany({
      select: {
        uno: true,
        username: true,
        firstname: true,
        lastname: true,
        userlevel: true,
        file_name1: true,
        original_file_name1: true,
        status: true,
        signdate: true,
      },
      skip,
      take,
      orderBy: { uno: 'desc' },
    });

    const total = await prisma.members.count();
    const serialized = serializeBigInt(members);
    const serializedTotal = typeof total === 'bigint' ? total.toString() : total;

    return Response.json({
      success: true,
      data: serialized,
      total: serializedTotal,
      skip,
      take,
    });
  } catch (error) {
    console.error('Error in GET /api/members:', error);
    return Response.json(
      { success: false, message: '회원 데이터를 불러오는 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
