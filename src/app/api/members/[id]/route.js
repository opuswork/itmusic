import { prisma } from '@/lib/prisma';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

function parseId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

export async function GET(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid member id' }, { status: 400 });
    }
    const member = await prisma.members.findUnique({
      where: { uno: id },
    });
    if (!member) {
      return Response.json({ success: false, message: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
    return Response.json({ success: true, data: serializeBigInt(member) });
  } catch (error) {
    console.error('Error in GET /api/members/[id]:', error);
    return Response.json(
      { success: false, message: '회원 조회 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid member id' }, { status: 400 });
    }
    const body = await request.json();
    const updateData = {};
    if (body.status !== undefined) {
      const s = String(body.status).toLowerCase();
      if (s === 'pending' || s === 'approved') updateData.status = s;
    }
    if (body.userlevel !== undefined) {
      const u = String(body.userlevel);
      const levelMap = { '1': 'LEVEL_1', '12': 'LEVEL_12', '20': 'LEVEL_20', '80': 'LEVEL_80' };
      if (levelMap[u] !== undefined) updateData.userlevel = levelMap[u];
    }

    const member = await prisma.members.update({
      where: { uno: id },
      data: updateData,
    });
    return Response.json({ success: true, data: serializeBigInt(member) });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in PUT /api/members/[id]:', error);
    return Response.json(
      { success: false, message: '회원 수정 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    if (id == null) {
      return Response.json({ success: false, message: 'Invalid member id' }, { status: 400 });
    }
    await prisma.members.delete({ where: { uno: id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return Response.json({ success: false, message: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
    console.error('Error in DELETE /api/members/[id]:', error);
    return Response.json(
      { success: false, message: '회원 삭제 중 오류가 발생했습니다.', error: error.message },
      { status: 500 }
    );
  }
}
