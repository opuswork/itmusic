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
      return Response.json({ success: false, message: 'Invalid competition id' }, { status: 400 });
    }
    const competition = await prisma.events.findUnique({
      where: { num: id },
    });
    if (!competition) {
      return Response.json({ success: false, message: '콩쿠르를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(competition) });
  } catch (error) {
    console.error('Error in GET /api/competitions/[id]:', error);
    return Response.json(
      { success: false, message: '콩쿠르 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid competition id' }, { status: 400 });
    }
    const body = await request.json();
    const str = (v) => (v != null && v !== '' ? String(v).slice(0, 512) : null);
    const updateData = {};
    if (body.order_num !== undefined) updateData.order_num = BigInt(Number(body.order_num));
    if (body.category !== undefined) updateData.category = body.category != null && body.category !== '' ? String(body.category).slice(0, 255) : null;
    if (body.subject !== undefined) updateData.subject = String(body.subject ?? '').slice(0, 128);
    if (body.content !== undefined) updateData.content = body.content != null ? String(body.content) : '';
    if (body.location !== undefined) updateData.location = String(body.location ?? '다큐홀').slice(0, 255);
    if (body.operator !== undefined) updateData.operator = String(body.operator ?? '').slice(0, 100);
    if (body.planner !== undefined) updateData.planner = String(body.planner ?? '').slice(0, 100);
    if (body.supporter !== undefined) updateData.supporter = String(body.supporter ?? '').slice(0, 255);
    if (body.event_start_date !== undefined) updateData.event_start_date = body.event_start_date ? new Date(body.event_start_date) : null;
    if (body.event_end_date !== undefined) updateData.event_end_date = body.event_end_date ? new Date(body.event_end_date) : null;
    if (body.file_name1 !== undefined) updateData.file_name1 = str(body.file_name1);
    if (body.file_name2 !== undefined) updateData.file_name2 = str(body.file_name2);
    if (body.file_name3 !== undefined) updateData.file_name3 = str(body.file_name3);
    if (body.originalFileName1 !== undefined) updateData.original_file_name1 = str(body.originalFileName1);
    if (body.originalFileName2 !== undefined) updateData.original_file_name2 = str(body.originalFileName2);
    if (body.originalFileName3 !== undefined) updateData.original_file_name3 = str(body.originalFileName3);

    const competition = await prisma.events.update({
      where: { num: id },
      data: updateData,
    });
    return Response.json({ success: true, data: serializeBigInt(competition) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '콩쿠르를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/competitions/[id]:', error);
    return Response.json(
      { success: false, message: '콩쿠르 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid competition id' }, { status: 400 });
    }
    await prisma.events.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '콩쿠르를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/competitions/[id]:', error);
    return Response.json(
      { success: false, message: '콩쿠르 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
