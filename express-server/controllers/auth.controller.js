import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// JWT 토큰 생성
function generateToken(user) {
  return jwt.sign(
    { 
      uno: user.uno, 
      username: user.username 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 로그인
async function login(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "아이디와 비밀번호를 입력해주세요." 
      });
    }

    // 사용자 조회
    const user = await prisma.members.findUnique({
      where: { username: id },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "아이디 또는 비밀번호가 올바르지 않습니다." 
      });
    }

    // 비밀번호 확인 (bcrypt로 해시된 비밀번호 비교)
    const isPasswordValid = await bcrypt.compare(password, user.passwd);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "아이디 또는 비밀번호가 올바르지 않습니다." 
      });
    }

    // JWT 토큰 생성
    const token = generateToken(user);

    // 쿠키에 토큰 설정
    res.cookie("AccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.json({
      success: true,
      message: "로그인 성공",
      user: {
        uno: user.uno,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "서버 오류가 발생했습니다." 
    });
  }
}

// 로그아웃
function logout(req, res) {
  res.clearCookie("AccessToken");
  res.json({ 
    success: true, 
    message: "로그아웃되었습니다." 
  });
}

// 인증 확인 (미들웨어용)
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.AccessToken;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "인증이 필요합니다." 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 사용자 정보 조회
    const user = await prisma.members.findUnique({
      where: { uno: decoded.uno },
      select: {
        uno: true,
        username: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "유효하지 않은 토큰입니다." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "인증이 만료되었습니다." 
      });
    }
    console.error("Token verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "서버 오류가 발생했습니다." 
    });
  }
}

// 현재 사용자 정보 조회
async function getCurrentUser(req, res) {
  try {
    const token = req.cookies.AccessToken;

    if (!token) {
      return res.json({ 
        success: false, 
        isAuthenticated: false 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.members.findUnique({
      where: { uno: decoded.uno },
      select: {
        uno: true,
        username: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!user) {
      return res.json({ 
        success: false, 
        isAuthenticated: false 
      });
    }

    res.json({
      success: true,
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    res.json({ 
      success: false, 
      isAuthenticated: false 
    });
  }
}

// 카카오 로그인 시작 (카카오 인증 페이지로 리다이렉트)
function kakaoLogin(req, res) {
  try {
    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    // 카카오 콜백은 백엔드 서버로 오도록 설정
    const BACKEND_URL = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:3001';
    // 카카오 개발자 콘솔에 등록된 URI에 맞춰 /api/auth/kakao/callback 사용
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${BACKEND_URL}/api/auth/kakao/callback`;
    // prompt=login 파라미터를 추가하여 항상 로그인 화면을 보여줌
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&prompt=login`;

    if (!KAKAO_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "카카오 클라이언트 ID가 설정되지 않았습니다.",
      });
    }

    res.redirect(KAKAO_AUTH_URL);
  } catch (error) {
    console.error("Kakao login error:", error);
    res.status(500).json({
      success: false,
      message: "카카오 로그인 초기화에 실패했습니다.",
    });
  }
}

// 카카오 로그인 콜백 (인증 코드를 받아서 토큰 교환 및 사용자 정보 가져오기)
async function kakaoCallback(req, res) {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=kakao_auth_failed`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`);
    }

    const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
    // 카카오 콜백은 백엔드 서버로 오도록 설정
    const BACKEND_URL = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:3001';
    // 카카오 개발자 콘솔에 등록된 URI에 맞춰 /api/auth/kakao/callback 사용
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${BACKEND_URL}/api/auth/kakao/callback`;

    if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=config_error`);
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
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=token_exchange_failed`);
    }

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const kakaoUser = await userInfoResponse.json();

    if (!userInfoResponse.ok || !kakaoUser.id) {
      console.error('Kakao user info error:', kakaoUser);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=user_info_failed`);
    }

    // 3. 카카오 사용자 정보 파싱
    const kakaoId = kakaoUser.id.toString();
    const kakaoEmail = kakaoUser.kakao_account?.email || null;
    const kakaoNickname = kakaoUser.kakao_account?.profile?.nickname || kakaoUser.properties?.nickname || '카카오사용자';
    const kakaoProfileImage = kakaoUser.kakao_account?.profile?.profile_image_url || kakaoUser.properties?.profile_image || null;

    // 4. DB에서 사용자 찾기 또는 생성
    let user = await prisma.members.findFirst({
      where: {
        OR: [
          { username: `kakao_${kakaoId}` },
          { email: kakaoEmail },
        ],
      },
    });

    if (!user) {
      // 새 사용자 생성 (필수 필드 모두 채우기)
      // firstname이 30자를 초과하면 잘라내기
      const truncatedFirstname = kakaoNickname.length > 30 ? kakaoNickname.substring(0, 30) : kakaoNickname;
      
      user = await prisma.members.create({
        data: {
          username: `kakao_${kakaoId}`,
          email: kakaoEmail,
          firstname: truncatedFirstname,
          lastname: '',
          passwd: '$2b$10$KAKAOLOGINNOPASSWORDREQUIRED', // 소셜 로그인은 비밀번호 없음 (bcrypt 더미 해시)
          sex: 0, // 기본값
          company_school: '', // 기본값
          school_name: '', // 기본값
          membership_fee_paydate: new Date(), // 현재 날짜
        },
      });
    }

    // 5. JWT 토큰 생성
    const token = generateToken(user);

    // 6. 쿠키에 토큰 설정
    res.cookie("AccessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    // 7. 프론트엔드로 리다이렉트
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/?kakao_login=success`);
  } catch (error) {
    console.error("Kakao callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server_error`);
  }
}

const AuthController = {
  login,
  logout,
  verifyToken,
  getCurrentUser,
  kakaoLogin,
  kakaoCallback,
};

export default AuthController;
