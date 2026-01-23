# Express → Next.js API Routes 마이그레이션 가이드

## ✅ 완료된 작업

### 1. API Routes 생성
모든 Express 라우터를 Next.js API Routes로 변환했습니다:

- `/api/directors` - 음악감독
- `/api/teachers` - 지도위원
- `/api/executives` - 상임이사
- `/api/consultants` - 상임고문
- `/api/operators` - 이사진
- `/api/notices` - 공지사항
- `/api/concerts` - 공연소식
- `/api/competitions` - 콩쿠르
- `/api/videos` - 마스터클래스/협회원 연주영상
- `/api/sliders` - 슬라이더
- `/api/auth/login` - 로그인
- `/api/auth/logout` - 로그아웃
- `/api/auth/me` - 현재 사용자 정보
- `/api/auth/kakao` - 카카오 로그인 시작
- `/api/auth/kakao/callback` - 카카오 로그인 콜백

### 2. 공통 유틸리티 생성
- `src/lib/prisma.js` - Prisma 클라이언트 싱글톤
- `src/lib/utils/serializeBigInt.js` - BigInt/Date 직렬화 유틸리티

### 3. 프론트엔드 API 호출 경로 수정
- `src/lib/http/client.js`의 `baseURL`을 `/api`로 변경
- 모든 이미지 경로를 `/assets/`로 변경 (Next.js public 폴더 사용)

### 4. 의존성 추가
- `@prisma/client`
- `bcrypt`
- `jsonwebtoken`

## 📋 Vercel 배포 전 체크리스트

### 1. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들을 설정해야 합니다:

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-jwt-key-change-in-production
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=https://your-domain.vercel.app/api/auth/kakao/callback
FRONTEND_URL=https://your-domain.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 2. Prisma 설정
1. Prisma 스키마 위치: `express-server/prisma/schema.prisma`
2. Prisma 클라이언트 생성 위치: `express-server/generated/prisma`
3. `package.json`에 `postinstall` 스크립트 추가됨:
   ```json
   "postinstall": "prisma generate --schema=./express-server/prisma/schema.prisma"
   ```

### 3. 정적 파일 설정
- `public/assets/` 폴더의 파일들이 자동으로 서빙됩니다.
- 이미지 경로는 모두 `/assets/...` 형식으로 변경되었습니다.

### 4. 카카오 로그인 리다이렉트 URI 업데이트
카카오 개발자 콘솔에서 리다이렉트 URI를 업데이트:
```
https://your-domain.vercel.app/api/auth/kakao/callback
```

## 🔧 추가 작업 필요 사항

### 1. Prisma 클라이언트 생성 확인
배포 전에 로컬에서 Prisma 클라이언트가 생성되는지 확인:
```bash
npm install
npx prisma generate --schema=./express-server/prisma/schema.prisma
```

### 2. 데이터베이스 마이그레이션
필요한 경우:
```bash
npx prisma migrate deploy --schema=./express-server/prisma/schema.prisma
```

### 3. Express 서버 제거 (선택사항)
더 이상 Express 서버가 필요하지 않다면:
- `express-server/` 폴더는 Prisma 스키마와 생성된 클라이언트를 위해 유지
- 또는 Prisma 스키마를 프로젝트 루트로 이동 고려

## 🚀 Vercel 배포 단계

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Migrate Express to Next.js API Routes"
   git push
   ```

2. **Vercel 프로젝트 생성**
   - Vercel 대시보드에서 "New Project" 클릭
   - GitHub 저장소 연결
   - 프로젝트 설정:
     - Framework Preset: Next.js
     - Root Directory: `Nextjs-Itmusic-FE` (또는 프로젝트 루트)
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - 위의 환경 변수 목록 추가

4. **배포**
   - Vercel이 자동으로 배포를 시작합니다
   - 배포 로그에서 Prisma 클라이언트 생성 확인

## ⚠️ 주의사항

1. **Prisma 클라이언트 경로**
   - 현재 `express-server/generated/prisma`를 사용 중
   - `src/lib/prisma.js`에서 경로 확인 필요

2. **쿠키 설정**
   - Next.js API Routes에서 쿠키는 `cookies()` 함수 사용
   - `httpOnly`, `secure`, `sameSite` 설정 확인

3. **CORS**
   - Next.js는 자동으로 CORS를 처리하므로 별도 설정 불필요
   - 같은 도메인에서 API를 호출하므로 CORS 문제 없음

4. **파일 업로드**
   - 현재 `uploads/` 디렉토리 사용 중
   - Vercel은 무상태(stateless)이므로 파일 업로드는 S3 등 외부 저장소 사용 권장

## 🐛 문제 해결

### Prisma 클라이언트를 찾을 수 없음
```bash
npx prisma generate --schema=./express-server/prisma/schema.prisma
```

### 데이터베이스 연결 오류
- `DATABASE_URL` 환경 변수 확인
- Vercel에서 환경 변수가 설정되었는지 확인

### 이미지가 표시되지 않음
- `public/assets/` 폴더에 파일이 있는지 확인
- 이미지 경로가 `/assets/...` 형식인지 확인

### 카카오 로그인 오류
- 카카오 개발자 콘솔에서 리다이렉트 URI 확인
- `KAKAO_REDIRECT_URI` 환경 변수 확인
