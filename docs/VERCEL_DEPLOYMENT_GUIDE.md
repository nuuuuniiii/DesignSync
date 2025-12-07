# Vercel 배포 가이드

## 프로젝트 구조

이 프로젝트는 모노레포 구조로, 프론트엔드와 백엔드를 별도의 Vercel 프로젝트로 배포해야 합니다.

```
DesignSync/
├── frontend/          ← 프론트엔드 (별도 Vercel 프로젝트)
│   ├── vercel.json   (또는 루트의 vercel.json)
│   └── ...
└── backend/          ← 백엔드 (별도 Vercel 프로젝트)
    ├── vercel.json
    └── ...
```

## 1. 백엔드 배포 (처음 한 번만)

### Vercel 대시보드에서:

1. **새 프로젝트 추가** 또는 기존 프로젝트 선택
2. **GitHub 리포지토리 연결**: `nuuuuniiii/DesignSync`
3. **프로젝트 설정**:
   - **Root Directory**: `backend` 설정 ⚠️ 중요!
   - **Framework Preset**: Other
   - **Build Command**: `npm run build` (자동 감지될 수 있음)
   - **Output Directory**: `.` (또는 비워두기)
   - **Install Command**: `npm ci` (자동 감지될 수 있음)

4. **Environment Variables 추가**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`
   - `PORT` (선택사항, 기본값: 8000)
   - `CORS_ORIGIN` (프론트엔드 URL, 예: `https://your-frontend.vercel.app`)

5. **Deploy** 클릭

6. 배포 완료 후 백엔드 URL 확인 (예: `https://designsync-backend.vercel.app`)

## 2. 프론트엔드 배포 (이미 되어 있다면 건너뛰기)

### Vercel 대시보드에서:

1. **새 프로젝트 추가** 또는 기존 프로젝트 선택
2. **GitHub 리포지토리 연결**: `nuuuuniiii/DesignSync`
3. **프로젝트 설정**:
   - **Root Directory**: `frontend` 설정 ⚠️ 중요!
   - **Framework Preset**: Vite (자동 감지될 수 있음)
   - **Build Command**: 자동 감지
   - **Output Directory**: `dist` (자동 감지될 수 있음)
   - **Install Command**: `npm ci` (자동 감지될 수 있음)

4. **Environment Variables 추가**:
   - `VITE_API_BASE_URL`: 백엔드 URL + `/api` (예: `https://designsync-backend.vercel.app/api`)

5. **Deploy** 클릭

## 3. 프론트엔드 재배포 (백엔드 배포 후)

백엔드 배포가 완료되어 URL을 알게 되면:

1. **프론트엔드 Vercel 프로젝트** 선택
2. **Settings** → **Environment Variables**
3. `VITE_API_BASE_URL` 환경변수 추가/수정:
   - Value: 백엔드 URL + `/api` (예: `https://designsync-backend.vercel.app/api`)
4. **Deployments** 탭으로 이동
5. 최신 배포 옆 **⋮** (메뉴) → **Redeploy** 클릭

또는 코드를 커밋하고 푸시하면 자동으로 재배포됩니다.

## 확인 사항

### 백엔드가 정상 작동하는지 확인:
```bash
curl https://your-backend.vercel.app/health
# 응답: {"status":"ok","message":"DesignSync API Server"}
```

### 프론트엔드가 백엔드와 연결되었는지 확인:
- 프론트엔드 사이트 접속
- 개발자 도구 (F12) → Network 탭
- API 요청이 백엔드 URL로 가는지 확인

## 문제 해결

### "cd frontend: No such file or directory" 에러
- 백엔드 배포 시 Root Directory가 `backend`로 설정되어 있는지 확인
- 프론트엔드 배포 시 Root Directory가 `frontend`로 설정되어 있는지 확인

### "API 엔드포인트를 찾을 수 없습니다" 에러
- 프론트엔드의 `VITE_API_BASE_URL` 환경변수가 올바르게 설정되었는지 확인
- 백엔드 URL이 올바른지 확인
- CORS 설정 확인 (백엔드의 `CORS_ORIGIN`이 프론트엔드 URL과 일치하는지)

