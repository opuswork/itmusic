import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

function parseId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return null;
  return BigInt(n);
}

export async function GET(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid executive id' }, { status: 400 });
    }
    const executive = await prisma.board_trustee.findUnique({
      where: { num: id },
    });
    if (!executive) {
      return Response.json({ success: false, message: '상임이사를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(executive) });
  } catch (error) {
    console.error('Error in GET /api/executives/[id]:', error);
    return Response.json(
      { success: false, message: '상임이사 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid executive id' }, { status: 400 });
    }
    const body = await request.json();
    const updateData = {};
    if (body.order_num !== undefined) updateData.order_num = BigInt(Number(body.order_num));
    if (body.name !== undefined) updateData.name = body.name != null ? String(body.name).slice(0, 255) : null;
    if (body.profile !== undefined) updateData.profile = String(body.profile);
    if (body.position !== undefined) updateData.position = String(body.position);
    if (body.file_name1 !== undefined) updateData.file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 100) : null;

    const executive = await prisma.board_trustee.update({
      where: { num: id },
      data: updateData,
    });
    return Response.json({ success: true, data: serializeBigInt(executive) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '상임이사를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/executives/[id]:', error);
    return Response.json(
      { success: false, message: '상임이사 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid executive id' }, { status: 400 });
    }
    await prisma.board_trustee.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '상임이사를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/executives/[id]:', error);
    return Response.json(
      { success: false, message: '상임이사 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
