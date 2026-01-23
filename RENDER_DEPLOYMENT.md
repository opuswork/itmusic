# Render.com 배포 가이드

## 🚨 배포 전 필수 확인 사항

### 1. 백엔드 서비스 (Express Server) 설정

#### 환경 변수 설정
Render.com 대시보드에서 다음 환경 변수들을 설정해야 합니다:

```
DATABASE_URL=postgresql://user:password@host:port/database
FRONTEND_URL=https://your-frontend-domain.onrender.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend-service.onrender.com
JWT_SECRET=your-secret-jwt-key-change-in-production
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=https://your-backend-service.onrender.com/api/auth/kakao/callback
BACKEND_URL=https://your-backend-service.onrender.com
NODE_ENV=production
PORT=10000 (Render가 자동으로 설정하지만 명시적으로 설정 가능)
```

#### 빌드 명령어
```
npm install
```

#### 시작 명령어
```
npm start
```

#### 서비스 루트 디렉토리
```
express-server
```

### 2. 프론트엔드 서비스 (Next.js) 설정

#### 환경 변수 설정
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-service.onrender.com
```

#### 빌드 명령어
```
npm install && npm run build
```

#### 시작 명령어
```
npm start
```

#### 서비스 루트 디렉토리
```
Nextjs-Itmusic-FE
```

### 3. 데이터베이스 설정

#### PostgreSQL 데이터베이스 생성
1. Render.com에서 PostgreSQL 데이터베이스를 생성합니다.
2. `DATABASE_URL` 환경 변수에 연결 정보를 설정합니다.
3. 로컬에서 마이그레이션을 실행하거나, Render의 데이터베이스에 직접 연결하여 스키마를 적용합니다.

#### Prisma 마이그레이션 (선택사항)
로컬에서 마이그레이션을 실행하려면:
```bash
cd express-server
npx prisma migrate deploy
```

또는 Render의 Shell에서 실행:
```bash
cd express-server
npx prisma migrate deploy
```

### 4. 파일 업로드 경로 문제 ⚠️

**현재 문제점:**
- `uploads/` 디렉토리에 파일을 저장하고 있습니다.
- Render의 파일시스템은 임시적이므로 서비스 재시작 시 파일이 사라집니다.

**해결 방법:**
1. **AWS S3 사용 (권장)**: 파일을 S3에 업로드하도록 수정
2. **Render Disk Volume 사용**: Render의 영구 디스크 볼륨 사용 (유료 플랜 필요)
3. **데이터베이스에 저장**: 작은 파일의 경우 데이터베이스에 BLOB으로 저장

### 5. 정적 파일 경로

현재 `public/assets` 폴더의 파일들이 정상적으로 서빙되는지 확인해야 합니다.
- Render에서는 빌드 시 `public` 폴더가 포함되어야 합니다.
- 또는 CDN을 사용하여 정적 파일을 서빙하는 것을 고려하세요.

### 6. CORS 설정

`app.js`에서 CORS 설정이 `FRONTEND_URL` 환경 변수를 사용하도록 되어 있습니다.
프로덕션 환경에서는 정확한 프론트엔드 URL을 설정해야 합니다.

### 7. 카카오 로그인 리다이렉트 URI

카카오 개발자 콘솔에서 리다이렉트 URI를 Render URL로 업데이트해야 합니다:
```
https://your-backend-service.onrender.com/api/auth/kakao/callback
```

## 📋 배포 체크리스트

- [ ] PostgreSQL 데이터베이스 생성 및 연결
- [ ] 백엔드 서비스 환경 변수 설정
- [ ] 프론트엔드 서비스 환경 변수 설정
- [ ] Prisma 클라이언트 생성 확인 (`postinstall` 스크립트)
- [ ] 파일 업로드 경로 문제 해결 (S3 또는 Disk Volume)
- [ ] 카카오 로그인 리다이렉트 URI 업데이트
- [ ] CORS 설정 확인
- [ ] 정적 파일 경로 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 로그 확인 및 에러 체크

## 🔧 추가 권장 사항

1. **Health Check 엔드포인트 추가**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({ status: 'ok' });
   });
   ```

2. **에러 핸들링 개선**
   - 프로덕션 환경에서는 상세한 에러 정보를 노출하지 않도록 설정

3. **로깅 개선**
   - 구조화된 로깅 시스템 도입 (Winston, Pino 등)

4. **모니터링**
   - Render의 로그 모니터링 기능 활용
   - 필요시 외부 모니터링 서비스 연동

## 🐛 문제 해결

### 포트 에러
- `PORT` 환경 변수가 자동으로 설정되는지 확인
- `app.js`에서 `process.env.PORT`를 사용하는지 확인

### Prisma 에러
- `prisma generate`가 빌드 시 실행되는지 확인
- `postinstall` 스크립트가 작동하는지 확인

### 데이터베이스 연결 에러
- `DATABASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- SSL 연결이 필요한 경우 `?sslmode=require` 추가

### CORS 에러
- `FRONTEND_URL` 환경 변수가 정확한 URL로 설정되었는지 확인
- 브라우저 콘솔에서 CORS 에러 메시지 확인
