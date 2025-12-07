# Vercel 환경변수 설정 가이드

## 프론트엔드: https://design-sync-vp26.vercel.app/
## 백엔드: https://design-sync-iota.vercel.app/

## 1. 백엔드 환경변수 설정

Vercel 대시보드 → **백엔드 프로젝트 (design-sync-iota)** → Settings → Environment Variables

다음 환경변수들을 추가/수정하세요:

### 필수 환경변수:
- `CORS_ORIGIN`: `https://design-sync-vp26.vercel.app`
- `SUPABASE_URL`: (Supabase 프로젝트의 URL)
- `SUPABASE_SERVICE_ROLE_KEY`: (Supabase 프로젝트의 Service Role Key) ⚠️
- `SUPABASE_ANON_KEY`: (Supabase 프로젝트의 Anon/Public Key) ⚠️ **필수!**
- `CLOUDINARY_CLOUD_NAME`: (기존 값 유지)
- `CLOUDINARY_API_KEY`: (기존 값 유지)
- `CLOUDINARY_API_SECRET`: (기존 값 유지)
- `JWT_SECRET`: (기존 값 유지, 선택사항)

⚠️ **중요**: `SUPABASE_ANON_KEY`는 회원가입/로그인에 필수입니다!

### 중요: 
환경변수 수정 후 **재배포**가 필요합니다!
- Deployments 탭 → 최신 배포 옆 ⋮ (메뉴) → Redeploy

## 2. 프론트엔드 환경변수 설정

Vercel 대시보드 → **프론트엔드 프로젝트 (design-sync-vp26)** → Settings → Environment Variables

다음 환경변수를 추가/수정하세요:

- `VITE_API_BASE_URL`: `https://design-sync-iota.vercel.app/api`

⚠️ **중요**: 
- URL 끝에 `/api`가 반드시 포함되어야 합니다
- `http`가 아닌 `https`를 사용해야 합니다
- 마지막에 슬래시(`/`) 없이 설정하세요

환경변수 수정 후 **재배포**가 필요합니다!

## 3. 확인 방법

### 백엔드 확인:
브라우저에서 접속:
```
https://design-sync-iota.vercel.app/health
```

예상 응답:
```json
{"status":"ok","message":"DesignSync API Server"}
```

### 프론트엔드에서 API 호출 확인:
1. 프론트엔드 사이트 접속: https://design-sync-vp26.vercel.app/
2. F12 (개발자 도구) → Network 탭
3. API 요청이 `https://design-sync-iota.vercel.app/api/...`로 가는지 확인

