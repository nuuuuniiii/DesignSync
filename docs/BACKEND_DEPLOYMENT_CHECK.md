# 백엔드 배포 위치 확인 방법

## 방법 1: Vercel 대시보드에서 확인

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 목록 확인
   - 프론트엔드 프로젝트: `DesignSync` 또는 유사한 이름
   - 백엔드 프로젝트: `DesignSync-Backend` 또는 유사한 이름이 별도로 있을 수 있음
3. 각 프로젝트의 **Settings > Domains**에서 배포 URL 확인

## 방법 2: GitHub 리포지토리에서 확인

1. GitHub 리포지토리 (`https://github.com/nuuuuniiii/DesignSync`) 접속
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Integrations** 또는 **Webhooks** 확인
4. Vercel 연동 여부 확인

## 방법 3: 환경변수에서 확인

프론트엔드 Vercel 프로젝트의 환경변수 확인:
1. Vercel 대시보드 > 프론트엔드 프로젝트 > Settings > Environment Variables
2. `VITE_API_BASE_URL` 변수가 있는지 확인
3. 있다면 그 값이 백엔드 URL입니다

## 방법 4: 브라우저 개발자 도구에서 확인

1. 배포된 프론트엔드 사이트 접속
2. 개발자 도구 (F12) 열기
3. Network 탭에서 API 요청 확인
4. 요청 URL을 확인하여 백엔드 URL 파악

## 백엔드가 배포되지 않은 경우

백엔드가 아직 배포되지 않았다면, 다음 중 하나를 선택해야 합니다:

### 옵션 1: 백엔드를 Vercel에 별도 프로젝트로 배포 (권장)

1. Vercel 대시보드에서 **Add New Project**
2. GitHub 리포지토리 선택 (`nuuuuniiii/DesignSync`)
3. **Root Directory**를 `backend`로 설정
4. **Framework Preset**: Other
5. **Build Command**: `npm run build`
6. **Output Directory**: (비워두기)
7. **Install Command**: `npm ci`
8. 환경변수 설정 (`.env` 파일의 모든 변수)
9. Deploy

### 옵션 2: 백엔드를 다른 플랫폼에 배포

- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

각 플랫폼의 가이드에 따라 배포하면 됩니다.

### 옵션 3: 백엔드를 로컬에서만 실행

개발 중이라면 백엔드를 로컬에서 실행하고, 프론트엔드 환경변수에 로컬 URL 설정:
- `VITE_API_BASE_URL=http://localhost:8000/api`

## 백엔드 URL 찾기 후 설정

백엔드 URL을 찾았다면:

1. Vercel 대시보드 > 프론트엔드 프로젝트 > Settings > Environment Variables
2. 다음 환경변수 추가/수정:
   - Name: `VITE_API_BASE_URL`
   - Value: 백엔드 URL (예: `https://your-backend.vercel.app/api`)
3. **Save** 후 재배포

