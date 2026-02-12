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
      return Response.json({ success: false, message: 'Invalid notice id' }, { status: 400 });
    }
    const notice = await prisma.notice.findUnique({
      where: { num: id },
    });
    if (!notice) {
      return Response.json({ success: false, message: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(notice) });
  } catch (error) {
    console.error('Error in GET /api/notices/[id]:', error);
    return Response.json(
      { success: false, message: '공지사항 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid notice id' }, { status: 400 });
    }
    const body = await request.json();
    const updateData = {};
    if (body.subject !== undefined) updateData.subject = String(body.subject ?? '').slice(0, 128);
    if (body.content !== undefined) updateData.content = body.content != null ? String(body.content) : '';
    if (body.category !== undefined) updateData.category = body.category != null && body.category !== '' ? String(body.category).slice(0, 255) : null;
    if (body.file_name1 !== undefined) updateData.file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 512) : null;
    if (body.originalFileName !== undefined) updateData.original_file_name = body.originalFileName != null && body.originalFileName !== '' ? String(body.originalFileName).slice(0, 512) : null;

    const notice = await prisma.notice.update({
      where: { num: id },
      data: updateData,
    });
    return Response.json({ success: true, data: serializeBigInt(notice) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/notices/[id]:', error);
    return Response.json(
      { success: false, message: '공지사항 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid notice id' }, { status: 400 });
    }
    await prisma.notice.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/notices/[id]:', error);
    return Response.json(
      { success: false, message: '공지사항 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
