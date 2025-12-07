# .env 파일 수정 가이드 (6-8번, 10-12번 라인)

## 현재 문제

`.env` 파일의 다음 라인들이 여전히 플레이스홀더 값으로 되어있습니다:

```
6: SUPABASE_URL=https://your-project.supabase.co          ❌ 플레이스홀더
7: SUPABASE_SERVICE_ROLE_KEY=your-service-role-key        ❌ 플레이스홀더

10: CLOUDINARY_CLOUD_NAME=your-cloud-name                 ❌ 플레이스홀더
11: CLOUDINARY_API_KEY=your-api-key                       ❌ 플레이스홀더
12: CLOUDINARY_API_SECRET=your-api-secret                 ❌ 플레이스홀더
```

## 수정 방법

### 방법 1: 직접 파일 편집

1. **파일 열기**
   ```bash
   cd backend
   code .env  # VS Code 사용 시
   # 또는
   nano .env  # 터미널 편집기 사용 시
   ```

2. **6-7번 라인 수정 (Supabase)**

   **변경 전:**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   **변경 후 (실제 값으로):**
   ```env
   SUPABASE_URL=https://실제프로젝트ID.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.실제토큰값
   ```

   **값 찾는 방법:**
   - Supabase Dashboard → Settings → API
   - Project URL 복사
   - service_role 키 복사

3. **10-12번 라인 수정 (Cloudinary)**

   **변경 전:**
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **변경 후 (실제 값으로):**
   ```env
   CLOUDINARY_CLOUD_NAME=실제클라우드이름
   CLOUDINARY_API_KEY=실제API키숫자
   CLOUDINARY_API_SECRET=실제시크릿문자열
   ```

   **값 찾는 방법:**
   - Cloudinary Dashboard
   - Cloud name 확인 (상단 표시)
   - Settings → Security → API Key, API Secret 복사

### 방법 2: 터미널에서 직접 수정

```bash
cd backend

# Supabase URL 수정 (6번 라인)
sed -i '' 's|SUPABASE_URL=https://your-project.supabase.co|SUPABASE_URL=실제URL|' .env

# Supabase Key 수정 (7번 라인)
sed -i '' 's|SUPABASE_SERVICE_ROLE_KEY=your-service-role-key|SUPABASE_SERVICE_ROLE_KEY=실제키|' .env

# Cloudinary 값들 수정 (10-12번 라인)
sed -i '' 's|CLOUDINARY_CLOUD_NAME=your-cloud-name|CLOUDINARY_CLOUD_NAME=실제이름|' .env
sed -i '' 's|CLOUDINARY_API_KEY=your-api-key|CLOUDINARY_API_KEY=실제키|' .env
sed -i '' 's|CLOUDINARY_API_SECRET=your-api-secret|CLOUDINARY_API_SECRET=실제시크릿|' .env
```

## 중요 사항

### ✅ 올바른 형식

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1OTg0ODAwLCJleHAiOjE5NjE1NjA4MDB9.실제토큰
CLOUDINARY_CLOUD_NAME=my-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### ❌ 잘못된 형식

```env
# 따옴표 사용 ❌
SUPABASE_URL="https://your-project.supabase.co"

# 공백 포함 ❌
SUPABASE_URL = https://your-project.supabase.co

# 플레이스홀더 그대로 ❌
SUPABASE_URL=https://your-project.supabase.co
```

## 수정 후 확인

1. **파일 내용 확인**
   ```bash
   cd backend
   cat .env | grep -E "SUPABASE|CLOUDINARY"
   ```
   - 플레이스홀더(`your-project`, `your-cloud-name` 등)가 보이면 안 됩니다

2. **서버 재시작**
   ```bash
   # 서버 중지 (Ctrl+C)
   cd backend
   npm run dev
   ```

3. **연결 테스트**
   ```
   http://localhost:8000/api/test/all
   ```
   - `"success": true` 응답이 나와야 합니다

## 체크리스트

- [ ] 6번 라인: `SUPABASE_URL`이 실제 프로젝트 URL로 변경됨
- [ ] 7번 라인: `SUPABASE_SERVICE_ROLE_KEY`가 실제 키로 변경됨
- [ ] 10번 라인: `CLOUDINARY_CLOUD_NAME`이 실제 클라우드 이름으로 변경됨
- [ ] 11번 라인: `CLOUDINARY_API_KEY`가 실제 API 키로 변경됨
- [ ] 12번 라인: `CLOUDINARY_API_SECRET`이 실제 시크릿으로 변경됨
- [ ] 플레이스홀더 값(`your-project`, `your-cloud-name` 등)이 하나도 없음
- [ ] 따옴표나 공백 없이 올바른 형식
- [ ] 서버 재시작 완료
- [ ] 연결 테스트 성공

