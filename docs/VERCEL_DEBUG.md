# Vercel 서버리스 함수 디버깅 가이드

## 백엔드 크래시 문제 해결

현재 백엔드가 크래시하고 있다면 다음을 확인하세요:

### 1. Vercel 로그 확인

1. Vercel 대시보드 → 백엔드 프로젝트
2. **Deployments** 탭 → 최신 배포 클릭
3. **Functions** 탭 → `api/index.ts` 클릭
4. **Logs** 탭에서 에러 메시지 확인

### 2. 일반적인 원인들

#### A. 환경변수 누락
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `JWT_SECRET`
- `CORS_ORIGIN`

**확인 방법:**
Vercel 대시보드 → Settings → Environment Variables

#### B. 빌드 파일 경로 문제
- `dist/routes/` 폴더가 제대로 빌드되었는지 확인
- Vercel에서 빌드 로그 확인

#### C. 의존성 문제
- `@vercel/node` 패키지가 설치되어 있는지 확인
- `package.json`의 dependencies 확인

### 3. 로컬 테스트

```bash
cd backend
npm run build
node dist/index.js
```

### 4. 간단한 테스트 엔드포인트

`/health` 엔드포인트가 작동하는지 먼저 확인:
```
https://your-backend.vercel.app/health
```

### 5. 에러 메시지 해석

- **"Routes not loaded properly"**: `dist/routes/` 파일을 찾을 수 없음
- **"Cannot find module"**: 의존성 문제 또는 경로 문제
- **"Environment variables are not set"**: 환경변수 누락

