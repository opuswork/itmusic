import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('AccessToken');

    return NextResponse.json({
      success: true,
      message: '로그아웃 성공',
      isAuthenticated: false,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '로그아웃 중 오류가 발생했습니다.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
