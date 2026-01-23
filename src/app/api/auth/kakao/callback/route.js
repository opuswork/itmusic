import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=kakao_auth_failed`);
    }

    if (!code) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=no_code`);
    }

    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
    const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${BACKEND_URL}/api/auth/kakao/callback`;

    if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=config_error`);
    }

    // 1. 인증 코드로 액세스 토큰 교환
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Kakao token error:', tokenData);
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=token_exchange_failed`);
    }

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const kakaoUser = await userInfoResponse.json();

    if (!userInfoResponse.ok || !kakaoUser.id) {
      console.error('Kakao user info error:', kakaoUser);
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=user_info_failed`);
    }

    // 3. 카카오 사용자 정보 파싱
    const kakaoId = kakaoUser.id.toString();
    const kakaoEmail = kakaoUser.kakao_account?.email || null;
    const kakaoNickname =
      kakaoUser.kakao_account?.profile?.nickname || kakaoUser.properties?.nickname || '카카오사용자';
    const kakaoProfileImage =
      kakaoUser.kakao_account?.profile?.profile_image_url || kakaoUser.properties?.profile_image || null;

    // 4. DB에서 사용자 찾기 또는 생성
    let user = await prisma.members.findFirst({
      where: {
        OR: [{ username: `kakao_${kakaoId}` }, { email: kakaoEmail }],
      },
    });

    if (!user) {
      const truncatedFirstname = kakaoNickname.length > 30 ? kakaoNickname.substring(0, 30) : kakaoNickname;

      user = await prisma.members.create({
        data: {
          username: `kakao_${kakaoId}`,
          email: kakaoEmail,
          firstname: truncatedFirstname,
          lastname: '',
          passwd: '$2b$10$KAKAOLOGINNOPASSWORDREQUIRED',
          sex: 0,
          company_school: '',
          school_name: '',
          membership_fee_paydate: new Date(),
        },
      });
    }

    // 5. JWT 토큰 생성
    const token = generateToken(user);

    // 6. 쿠키에 토큰 설정
    const cookieStore = await cookies();
    cookieStore.set('AccessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    // 7. 프론트엔드로 리다이렉트 (홈으로)
    return NextResponse.redirect(`${FRONTEND_URL}/`);
  } catch (error) {
    console.error('Kakao callback error:', error);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
}
