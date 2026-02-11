import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function generateToken(user) {
  return jwt.sign(
    {
      uno: user.uno,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, password, admin: isAdminLogin } = body;

    if (!id || !password) {
      return Response.json(
        {
          success: false,
          message: '아이디와 비밀번호를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    const user = await prisma.members.findUnique({
      where: { username: id },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwd);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
        { status: 401 }
      );
    }

    // 관리자 로그인인 경우 username이 'admin'인 회원만 허용 (members 테이블)
    if (isAdminLogin && user.username !== 'admin') {
      return Response.json(
        {
          success: false,
          message: '관리자(admin) 계정으로만 로그인할 수 있습니다.',
        },
        { status: 403 }
      );
    }

    const token = generateToken(user);

    const cookieStore = await cookies();
    cookieStore.set('AccessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7일
    });

    return Response.json({
      success: true,
      message: '로그인 성공',
      user: {
        uno: user.uno,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      {
        success: false,
        message: '로그인 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
