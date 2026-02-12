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
      return Response.json({ success: false, message: 'Invalid director id' }, { status: 400 });
    }
    const director = await prisma.itmusic_director.findUnique({
      where: { num: id },
    });
    if (!director) {
      return Response.json({ success: false, message: '음악감독을 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(director) });
  } catch (error) {
    console.error('Error in GET /api/directors/[id]:', error);
    return Response.json(
      { success: false, message: '음악감독 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid director id' }, { status: 400 });
    }
    const body = await request.json();
    const updateData = {};
    if (body.name !== undefined) updateData.name = String(body.name ?? '').slice(0, 128);
    if (body.position !== undefined) updateData.position = String(body.position ?? '').slice(0, 128);
    if (body.text !== undefined) updateData.text = body.text != null && body.text !== '' ? String(body.text) : null;
    if (body.file_name1 !== undefined) updateData.file_name1 = body.file_name1 != null && body.file_name1 !== '' ? String(body.file_name1).slice(0, 512) : null;
    if (body.originalFileName !== undefined) updateData.original_file_name = body.originalFileName != null && body.originalFileName !== '' ? String(body.originalFileName).slice(0, 512) : null;

    const director = await prisma.itmusic_director.update({
      where: { num: id },
      data: updateData,
    });
    return Response.json({ success: true, data: serializeBigInt(director) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '음악감독을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/directors/[id]:', error);
    return Response.json(
      { success: false, message: '음악감독 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid director id' }, { status: 400 });
    }
    await prisma.itmusic_director.delete({ where: { num: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '음악감독을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/directors/[id]:', error);
    return Response.json(
      { success: false, message: '음악감독 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
