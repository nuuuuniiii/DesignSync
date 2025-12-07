# 연결 문제 해결 가이드

## 문제: 연결 테스트 실패

연결 테스트에서 다음과 같은 에러가 발생하는 경우 해결 방법을 안내합니다.

## 1. 환경변수 확인

### 1.1 .env 파일 위치 확인

`.env` 파일이 `backend/` 디렉토리에 올바르게 위치해 있는지 확인하세요:

```bash
cd backend
ls -la .env
```

### 1.2 환경변수 값 확인

```bash
cd backend
cat .env
```

다음 값들이 **플레이스홀더가 아닌 실제 값**으로 설정되어 있어야 합니다:

```env
# ❌ 잘못된 예 (플레이스홀더)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ✅ 올바른 예 (실제 값)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-from-supabase-dashboard
```

### 1.3 환경변수 상태 확인 API

서버를 실행한 후 다음 URL로 환경변수 상태를 확인할 수 있습니다:

```
http://localhost:8000/api/test/env
```

이 API는 실제 값을 노출하지 않고 설정 상태만 확인합니다.

## 2. Supabase 연결 문제

### 2.1 "TypeError: fetch failed" 에러

**원인:**
- 잘못된 Supabase URL
- 네트워크 연결 문제
- 플레이스홀더 값 사용

**해결 방법:**

1. **Supabase Dashboard에서 URL 확인**
   - Supabase Dashboard → Settings → API
   - "Project URL" 복사
   - `backend/.env`의 `SUPABASE_URL`에 붙여넣기

2. **Service Role Key 확인**
   - Supabase Dashboard → Settings → API
   - "service_role" 키 복사 (⚠️ 주의: 이 키는 절대 공개되면 안 됩니다!)
   - `backend/.env`의 `SUPABASE_SERVICE_ROLE_KEY`에 붙여넣기

3. **.env 파일 형식 확인**
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   - 값에 공백이 없어야 합니다
   - 따옴표로 감싸지 마세요
   - ⚠️ **주의**: Service Role Key는 Supabase Dashboard에서 복사한 실제 키를 사용하세요. 예제 형식: `eyJhbGc...` (JWT 토큰 형식)

### 2.2 테이블 확인

Supabase Dashboard → Table Editor에서 다음 테이블들이 생성되어 있는지 확인:

- `users`
- `projects`
- `designs`
- `design_images`
- `feedbacks`
- 등등...

테이블이 없다면 `backend/migrations/001_initial_schema.sql` 파일을 Supabase SQL Editor에서 실행하세요.

## 3. Cloudinary 연결 문제

### 3.1 "Cloudinary connection failed" 에러

**원인:**
- 잘못된 Cloudinary 인증 정보
- 플레이스홀더 값 사용
- 계정 설정 문제

**해결 방법:**

1. **Cloudinary Dashboard에서 정보 확인**
   - Cloudinary Dashboard → Settings → Account Details
   - "Cloud name" 복사
   - `backend/.env`의 `CLOUDINARY_CLOUD_NAME`에 붙여넣기

2. **API Key와 Secret 확인**
   - Cloudinary Dashboard → Settings → Security
   - "API Key" 복사
   - "API Secret" 복사 (⚠️ 주의: Secret은 한 번만 표시됩니다!)
   - `backend/.env`에 붙여넣기

3. **.env 파일 형식 확인**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```
   - 값에 공백이 없어야 합니다
   - 따옴표로 감싸지 마세요

## 4. 서버 재시작

환경변수를 변경한 후에는 **반드시 서버를 재시작**해야 합니다:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
cd backend
npm run dev
```

## 5. 단계별 확인

### 단계 1: 환경변수 파일 확인
```bash
cd backend
cat .env | grep -E "SUPABASE|CLOUDINARY"
```

플레이스홀더 값(`your-project`, `your-cloud-name` 등)이 보이면 실제 값으로 변경하세요.

### 단계 2: 환경변수 상태 API 호출
```bash
curl http://localhost:8000/api/test/env
```

또는 브라우저에서 `http://localhost:8000/api/test/env` 접속

### 단계 3: 개별 연결 테스트
```bash
# 데이터베이스만 테스트
curl http://localhost:8000/api/test/database

# Cloudinary만 테스트
curl http://localhost:8000/api/test/cloudinary
```

### 단계 4: 전체 연결 테스트
```bash
curl http://localhost:8000/api/test/all
```

## 6. 일반적인 실수

### ❌ 실수 1: .env.example을 .env로 복사만 하고 값 변경 안 함
```bash
# 잘못된 방법
cp .env.example .env
# 값 변경 안 하고 서버 실행
```

### ✅ 올바른 방법
```bash
cp .env.example .env
# .env 파일을 열어서 실제 값으로 변경
nano .env  # 또는 vim, code 등
```

### ❌ 실수 2: 따옴표로 값 감싸기
```env
# 잘못된 예
SUPABASE_URL="https://your-project.supabase.co"

# 올바른 예
SUPABASE_URL=https://your-project.supabase.co
```

### ❌ 실수 3: 공백 포함
```env
# 잘못된 예
SUPABASE_URL = https://your-project.supabase.co

# 올바른 예
SUPABASE_URL=https://your-project.supabase.co
```

### ❌ 실수 4: 환경변수 변경 후 서버 재시작 안 함
환경변수를 변경하면 서버를 재시작해야 적용됩니다.

## 7. 추가 도움말

문제가 계속 발생하면:

1. **서버 로그 확인**
   ```bash
   cd backend
   tail -f logs/error.log
   ```

2. **환경변수 디버깅**
   - `backend/src/routes/test.routes.ts`의 `/env` 엔드포인트 확인

3. **Supabase/Cloudinary Dashboard 확인**
   - 계정이 활성화되어 있는지
   - API 키가 올바른지
   - 권한 설정이 올바른지

## 8. 체크리스트

연결 문제 해결을 위한 체크리스트:

- [ ] `.env` 파일이 `backend/` 디렉토리에 있음
- [ ] `SUPABASE_URL`이 실제 프로젝트 URL로 설정됨 (플레이스홀더 아님)
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 실제 키로 설정됨
- [ ] `CLOUDINARY_CLOUD_NAME`이 실제 클라우드 이름으로 설정됨
- [ ] `CLOUDINARY_API_KEY`가 실제 API 키로 설정됨
- [ ] `CLOUDINARY_API_SECRET`이 실제 시크릿으로 설정됨
- [ ] 환경변수 값에 공백이나 따옴표가 없음
- [ ] Supabase 테이블이 생성되어 있음
- [ ] 환경변수 변경 후 서버를 재시작함

