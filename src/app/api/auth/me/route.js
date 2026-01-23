import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { serializeBigInt } from '@/lib/utils/serializeBigInt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('AccessToken')?.value;

    if (!token) {
      return Response.json({
        success: false,
        message: '인증 토큰이 없습니다.',
        isAuthenticated: false,
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.members.findUnique({
        where: { uno: decoded.uno },
        select: {
          uno: true,
          username: true,
          firstname: true,
          lastname: true,
          email: true,
          userlevel: true,
        },
      });

      if (!user) {
        return Response.json({
          success: false,
          message: '사용자를 찾을 수 없습니다.',
          isAuthenticated: false,
        });
      }

      const serializedUser = serializeBigInt(user);

      return Response.json({
        success: true,
        user: serializedUser,
        isAuthenticated: true,
      });
    } catch (jwtError) {
      return Response.json({
        success: false,
        message: '유효하지 않은 토큰입니다.',
        isAuthenticated: false,
      });
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return Response.json(
      {
        success: false,
        message: '사용자 정보를 가져오는 중 오류가 발생했습니다.',
        error: error.message,
        isAuthenticated: false,
      },
      { status: 500 }
    );
  }
}
