# Vercel 데이터베이스 설정 가이드

## 📋 개요

Vercel은 데이터베이스를 직접 호스팅하지 않으므로, PostgreSQL 데이터베이스를 외부 서비스에서 설정해야 합니다.

## 🎯 추천 옵션

### 1. **Vercel Postgres** (가장 간단) ⭐ 추천
- Vercel과 완벽하게 통합
- 자동으로 환경 변수 설정
- 무료 플랜 제공 (Hobby 플랜)

### 2. **Supabase** (무료 플랜 좋음)
- PostgreSQL 기반
- 무료 플랜: 500MB 스토리지
- 관리 콘솔 제공

### 3. **Neon** (서버리스 PostgreSQL)
- 무료 플랜 제공
- 자동 스케일링
- Vercel과 잘 통합

### 4. **Railway** 또는 **Render**
- PostgreSQL 데이터베이스 제공
- 무료 플랜 있음

---

## 🚀 방법 1: Vercel Postgres 사용 (가장 추천)

### 단계 1: Vercel Postgres 생성

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택 또는 생성**
   - 기존 프로젝트 선택 또는 새 프로젝트 생성

3. **Storage 탭으로 이동**
   - 프로젝트 설정 → Storage 탭

4. **Postgres 생성**
   - "Create Database" 클릭
   - "Postgres" 선택
   - 지역 선택 (가장 가까운 지역)
   - "Create" 클릭

5. **환경 변수 자동 설정 확인**
   - Vercel이 자동으로 `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` 환경 변수를 설정합니다

### 단계 2: Prisma 스키마 업데이트

Vercel Postgres는 `POSTGRES_PRISMA_URL`을 사용합니다:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

또는 기존 `DATABASE_URL`을 유지하려면:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

그리고 Vercel 환경 변수에서 `DATABASE_URL`을 `POSTGRES_PRISMA_URL`과 동일하게 설정합니다.

### 단계 3: 데이터베이스 마이그레이션

로컬에서 마이그레이션을 실행하려면:

```bash
# Vercel Postgres 연결 문자열을 로컬 .env에 설정
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# 마이그레이션 실행
npx prisma migrate deploy --schema=express-server/prisma/schema.prisma
```

또는 Vercel의 데이터베이스에 직접 연결하여 SQL을 실행할 수 있습니다.

---

## 🚀 방법 2: Supabase 사용

### 단계 1: Supabase 프로젝트 생성

1. **Supabase 가입**
   - https://supabase.com 접속
   - GitHub 계정으로 가입

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - 프로젝트 이름, 데이터베이스 비밀번호 설정
   - 지역 선택 (가장 가까운 지역)
   - "Create new project" 클릭

3. **연결 정보 확인**
   - 프로젝트 설정 → Database → Connection string
   - "URI" 탭에서 연결 문자열 복사

### 단계 2: Vercel 환경 변수 설정

1. **Vercel 프로젝트 설정**
   - Settings → Environment Variables

2. **환경 변수 추가**
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   ```

### 단계 3: 데이터베이스 마이그레이션

```bash
# Supabase 연결 문자열을 로컬 .env에 설정
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require"

# 마이그레이션 실행
npx prisma migrate deploy --schema=express-server/prisma/schema.prisma
```

---

## 🚀 방법 3: Neon 사용

### 단계 1: Neon 프로젝트 생성

1. **Neon 가입**
   - https://neon.tech 접속
   - GitHub 계정으로 가입

2. **새 프로젝트 생성**
   - "Create a project" 클릭
   - 프로젝트 이름, 데이터베이스 이름 설정
   - 지역 선택
   - "Create project" 클릭

3. **연결 문자열 복사**
   - 프로젝트 대시보드에서 "Connection string" 복사

### 단계 2: Vercel 환경 변수 설정

Vercel 프로젝트 설정에서:
```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 단계 3: 데이터베이스 마이그레이션

로컬에서 마이그레이션 실행:
```bash
npx prisma migrate deploy --schema=express-server/prisma/schema.prisma
```

---

## 📝 기존 데이터베이스 데이터 마이그레이션

기존 PostgreSQL 데이터베이스가 있다면:

### 방법 1: pg_dump 사용 (권장)

```bash
# 기존 데이터베이스 덤프
pg_dump -h [기존호스트] -U [사용자명] -d [데이터베이스명] > backup.sql

# 새 데이터베이스로 복원
psql -h [새호스트] -U [사용자명] -d [데이터베이스명] < backup.sql
```

### 방법 2: Prisma Migrate 사용

1. **기존 데이터베이스에서 스키마 추출**
   ```bash
   npx prisma db pull --schema=express-server/prisma/schema.prisma
   ```

2. **마이그레이션 파일 생성**
   ```bash
   npx prisma migrate dev --name init --schema=express-server/prisma/schema.prisma
   ```

3. **새 데이터베이스에 적용**
   ```bash
   npx prisma migrate deploy --schema=express-server/prisma/schema.prisma
   ```

---

## ✅ Vercel 환경 변수 설정 체크리스트

Vercel 프로젝트 설정 → Environment Variables에서 다음을 설정:

### 필수 환경 변수

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-secret-jwt-key-change-in-production
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_REDIRECT_URI=https://your-domain.vercel.app/api/auth/kakao/callback
FRONTEND_URL=https://your-domain.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Vercel Postgres 사용 시

Vercel Postgres를 사용하면 다음 환경 변수가 자동으로 설정됩니다:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (Prisma용, 연결 풀링 포함)
- `POSTGRES_URL_NON_POOLING` (직접 연결용)

이 경우 `DATABASE_URL`을 `POSTGRES_PRISMA_URL`과 동일하게 설정하거나, Prisma 스키마를 수정해야 합니다.

---

## 🔧 Prisma 스키마 수정 (Vercel Postgres 사용 시)

`express-server/prisma/schema.prisma` 파일 수정:

```prisma
datasource db {
  provider = "postgresql"
  // Vercel Postgres 사용 시
  url      = env("POSTGRES_PRISMA_URL")
  
  // 또는 기존 방식 유지 (환경 변수에서 DATABASE_URL을 POSTGRES_PRISMA_URL로 설정)
  // url      = env("DATABASE_URL")
}
```

---

## 🚀 배포 순서

1. **데이터베이스 생성** (Vercel Postgres, Supabase, Neon 등)
2. **환경 변수 설정** (Vercel 대시보드)
3. **로컬에서 마이그레이션 실행** (선택사항)
4. **Vercel에 배포**
5. **배포 후 마이그레이션 실행** (Vercel CLI 또는 대시보드)

---

## 📚 참고 자료

- [Vercel Postgres 문서](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase 문서](https://supabase.com/docs)
- [Neon 문서](https://neon.tech/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## ⚠️ 주의사항

1. **SSL 연결**: 대부분의 클라우드 PostgreSQL은 SSL 연결을 요구합니다 (`?sslmode=require` 추가)
2. **연결 풀링**: Vercel Postgres는 자동으로 연결 풀링을 제공합니다
3. **환경 변수**: 프로덕션, 프리뷰, 개발 환경별로 설정 가능
4. **비밀번호**: 강력한 비밀번호 사용 및 안전하게 관리
