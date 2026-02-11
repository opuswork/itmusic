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
      return Response.json({ success: false, message: 'Invalid slider id' }, { status: 400 });
    }
    const slider = await prisma.slider.findUnique({
      where: { num: id },
      select: {
        num: true,
        subject: true,
        file_name1: true,
        original_file_name: true,
        link: true,
        reg_date: true,
        order_num: true,
        display: true,
      },
    });
    if (!slider) {
      return Response.json({ success: false, message: '슬라이더를 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(slider) });
  } catch (error) {
    console.error('Error in GET /api/sliders/[id]:', error);
    return Response.json(
      { success: false, message: '슬라이더 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid slider id' }, { status: 400 });
    }
    const body = await request.json();
    const { subject, link, file_name1, originalFileName } = body;

    const slider = await prisma.slider.update({
      where: { num: id },
      data: {
        ...(subject !== undefined && { subject: String(subject).slice(0, 128) }),
        ...(link !== undefined && { link: link != null && link !== '' ? String(link).slice(0, 255) : null }),
        ...(file_name1 !== undefined && { file_name1: file_name1 != null ? String(file_name1).slice(0, 512) : null }),
        ...(originalFileName !== undefined && { original_file_name: originalFileName != null ? String(originalFileName).slice(0, 255) : null }),
      },
    });
    return Response.json({ success: true, data: serializeBigInt(slider) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '슬라이더를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/sliders/[id]:', error);
    return Response.json(
      { success: false, message: '슬라이더 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid slider id' }, { status: 400 });
    }
    await prisma.slider.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '슬라이더를 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/sliders/[id]:', error);
    return Response.json(
      { success: false, message: '슬라이더 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
