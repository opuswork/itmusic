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
      return Response.json({ success: false, message: 'Invalid study id' }, { status: 400 });
    }
    const study = await prisma.study_abroad.findUnique({
      where: { num: id },
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
    });
    if (!study) {
      return Response.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(study) });
  } catch (error) {
    console.error('Error in GET /api/studies/[id]:', error);
    return Response.json(
      { success: false, message: '유학정보 게시물 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid study id' }, { status: 400 });
    }
    const body = await request.json();
    const { subject, content, category } = body;

    const study = await prisma.study_abroad.update({
      where: { num: id },
      data: {
        ...(subject !== undefined && { subject: String(subject).slice(0, 128) }),
        ...(content !== undefined && { content: content != null ? String(content) : null }),
        ...(category !== undefined && { category: category != null ? String(category).slice(0, 255) : null }),
      },
    });
    return Response.json({ success: true, data: serializeBigInt(study) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/studies/[id]:', error);
    return Response.json(
      { success: false, message: '유학정보 게시물 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid study id' }, { status: 400 });
    }
    await prisma.study_abroad.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '게시물을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/studies/[id]:', error);
    return Response.json(
      { success: false, message: '유학정보 게시물 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
