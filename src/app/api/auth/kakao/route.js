import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://itmusic.vercel.app';
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${BACKEND_URL}/api/auth/kakao/callback`;

    if (!KAKAO_CLIENT_ID) {
      return NextResponse.json(
        {
          success: false,
          message: '카카오 클라이언트 ID가 설정되지 않았습니다.',
        },
        { status: 500 }
      );
    }

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&prompt=login`;

    return NextResponse.redirect(KAKAO_AUTH_URL);
  } catch (error) {
    console.error('Kakao login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '카카오 로그인 초기화에 실패했습니다.',
      },
      { status: 500 }
    );
  }
}
