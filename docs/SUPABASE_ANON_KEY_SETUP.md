# SUPABASE_ANON_KEY 설정 가이드

## 문제
회원가입/로그인 시 500 에러 발생:
```
Supabase Auth is not configured. Please set SUPABASE_ANON_KEY in .env
```

## 원인
백엔드에서 Supabase Auth를 사용하려면 `SUPABASE_ANON_KEY` 환경변수가 필요합니다.

## 해결 방법

### 1. Supabase에서 Anon Key 확인

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Settings** (왼쪽 메뉴) → **API**
4. **Project API keys** 섹션에서:
   - **anon** `public` 키 복사 (이것이 `SUPABASE_ANON_KEY`입니다)
   - **service_role** 키도 확인 (이것이 `SUPABASE_SERVICE_ROLE_KEY`입니다)

### 2. Vercel에 환경변수 추가

1. Vercel 대시보드 → **백엔드 프로젝트** (design-sync-iota)
2. **Settings** → **Environment Variables**
3. 다음 환경변수 추가:
   - **Name**: `SUPABASE_ANON_KEY`
   - **Value**: Supabase에서 복사한 `anon` `public` 키
   - **Environment**: Production, Preview, Development 모두 선택
4. **Save** 클릭

### 3. 환경변수 확인

다음 환경변수들이 모두 설정되어 있어야 합니다:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_ANON_KEY` ← **이것이 누락되었을 가능성이 높습니다!**
- ✅ `CORS_ORIGIN`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

### 4. 재배포

환경변수 추가 후:
1. **Deployments** 탭으로 이동
2. 최신 배포 옆 **⋮** (메뉴) → **Redeploy** 클릭

⚠️ **중요**: 환경변수 변경 후 반드시 재배포해야 합니다!

## 확인 방법

재배포 후:
1. 브라우저에서 테스트: `https://design-sync-iota.vercel.app/health`
2. 회원가입 시도
3. Vercel 로그 확인: Deployments → 최신 배포 → Functions → `api/index.ts` → Logs

## 보안 참고사항

- `SUPABASE_ANON_KEY`는 **public** 키이므로 프론트엔드에 노출되어도 됩니다
- `SUPABASE_SERVICE_ROLE_KEY`는 **절대** 프론트엔드에 노출하면 안 됩니다 (서버 사이드에서만 사용)
- Vercel 환경변수는 암호화되어 저장됩니다

