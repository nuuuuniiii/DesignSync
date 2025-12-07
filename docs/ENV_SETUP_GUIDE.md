# .env 파일 설정 가이드

## 문제 상황

연결 테스트가 실패하는 경우, `.env` 파일에 플레이스홀더 값이 그대로 남아있을 수 있습니다.

## 해결 방법

### 1. Supabase 설정 값 가져오기

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Settings → API 이동**
   - 좌측 메뉴에서 "Settings" → "API" 클릭

3. **값 복사**
   - **Project URL** → `SUPABASE_URL`에 복사
     ```
     예: https://abcdefghijklmnop.supabase.co
     ```
   - **service_role 키** (Secret 키) → `SUPABASE_SERVICE_ROLE_KEY`에 복사
     ```
     ⚠️ 주의: service_role 키는 절대 공개되면 안 됩니다!
     ```

### 2. Cloudinary 설정 값 가져오기

1. **Cloudinary Dashboard 접속**
   - https://console.cloudinary.com/
   - 계정 로그인

2. **Dashboard에서 확인**
   - 상단에 **Cloud name** 표시됨 → `CLOUDINARY_CLOUD_NAME`에 복사

3. **Settings → Security 이동**
   - **API Key** → `CLOUDINARY_API_KEY`에 복사
   - **API Secret** → `CLOUDINARY_API_SECRET`에 복사
     ```
     ⚠️ 주의: API Secret은 한 번만 표시됩니다!
     ```

### 3. .env 파일 수정

`backend/.env` 파일을 열고 다음과 같이 수정하세요:

```bash
cd backend
nano .env  # 또는 code .env, vim .env 등
```

**변경 전 (플레이스홀더):**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**변경 후 (실제 값):**
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-from-dashboard
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. 주의사항

#### ❌ 하지 말아야 할 것

1. **따옴표로 감싸기**
   ```env
   # ❌ 잘못된 예
   SUPABASE_URL="https://your-project.supabase.co"
   
   # ✅ 올바른 예
   SUPABASE_URL=https://your-project.supabase.co
   ```

2. **공백 포함**
   ```env
   # ❌ 잘못된 예
   SUPABASE_URL = https://your-project.supabase.co
   
   # ✅ 올바른 예
   SUPABASE_URL=https://your-project.supabase.co
   ```

3. **플레이스홀더 값 그대로 두기**
   ```env
   # ❌ 잘못된 예
   SUPABASE_URL=https://your-project.supabase.co
   
   # ✅ 올바른 예
   SUPABASE_URL=https://실제프로젝트ID.supabase.co
   ```

### 5. 서버 재시작

`.env` 파일을 수정한 후에는 **반드시 서버를 재시작**해야 합니다:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
cd backend
npm run dev
```

### 6. 확인 방법

서버 재시작 후 다음 URL로 확인하세요:

1. **환경변수 상태 확인**
   ```
   http://localhost:8000/api/test/env
   ```
   - 플레이스홀더 값이 감지되면 경고 메시지가 표시됩니다

2. **연결 테스트**
   ```
   http://localhost:8000/api/test/all
   ```
   - 모든 연결이 성공하면 `"success": true` 응답이 나옵니다

## 체크리스트

- [ ] Supabase Dashboard에서 Project URL 복사
- [ ] Supabase Dashboard에서 service_role 키 복사
- [ ] Cloudinary Dashboard에서 Cloud name 확인
- [ ] Cloudinary Dashboard에서 API Key 복사
- [ ] Cloudinary Dashboard에서 API Secret 복사
- [ ] `backend/.env` 파일에 실제 값으로 업데이트
- [ ] 따옴표나 공백 없이 올바른 형식으로 입력
- [ ] 서버 재시작
- [ ] 연결 테스트 성공 확인

## 문제가 계속되면

1. **환경변수 파일 위치 확인**
   ```bash
   ls -la backend/.env
   ```
   - 파일이 `backend/` 디렉토리에 있어야 합니다

2. **서버 로그 확인**
   ```bash
   tail -f backend/logs/error.log
   ```

3. **환경변수 값 확인**
   ```bash
   cd backend
   cat .env | grep -E "SUPABASE|CLOUDINARY"
   ```
   - 플레이스홀더 값(`your-project`, `your-cloud-name` 등)이 보이면 실제 값으로 변경하세요

4. **자세한 문제 해결 가이드**
   - `docs/TROUBLESHOOTING.md` 파일 참고

