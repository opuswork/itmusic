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
      return Response.json({ success: false, message: 'Invalid video id' }, { status: 400 });
    }
    const video = await prisma.member_video.findUnique({
      where: { num: id },
      select: { num: true, subject: true, text: true, link: true, reg_date: true },
    });
    if (!video) {
      return Response.json({ success: false, message: '영상을 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(video) });
  } catch (error) {
    console.error('Error in GET /api/videos/[id]:', error);
    return Response.json(
      { success: false, message: '영상 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid video id' }, { status: 400 });
    }
    const body = await request.json();
    const { subject, text, link } = body;

    const video = await prisma.member_video.update({
      where: { num: id },
      data: {
        ...(subject !== undefined && { subject: String(subject).slice(0, 128) }),
        ...(text !== undefined && { text: text != null ? String(text) : null }),
        ...(link !== undefined && { link: link != null && link !== '' ? String(link).slice(0, 255) : null }),
      },
    });
    return Response.json({ success: true, data: serializeBigInt(video) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '영상을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/videos/[id]:', error);
    return Response.json(
      { success: false, message: '영상 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid video id' }, { status: 400 });
    }
    await prisma.member_video.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '영상을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/videos/[id]:', error);
    return Response.json(
      { success: false, message: '영상 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
