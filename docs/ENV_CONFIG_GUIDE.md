# 환경변수 설정 가이드

## .env 파일 설정 안내

### 기본값으로 사용 가능한 설정

다음 설정들은 **기본값 그대로 사용해도 됩니다** (선택적으로 변경 가능):

#### 1. Server 설정
```env
PORT=8000
NODE_ENV=development
```

- **PORT**: 백엔드 서버 포트 (기본값: 8000)
  - 변경하지 않아도 됩니다
  - 포트 8000이 이미 사용 중이면 다른 포트로 변경 가능

- **NODE_ENV**: 환경 모드 (기본값: development)
  - 개발 환경에서는 `development` 그대로 사용
  - 프로덕션 배포 시 `production`으로 변경

#### 2. CORS 설정
```env
CORS_ORIGIN=http://localhost:3000
```

- **CORS_ORIGIN**: 프론트엔드 주소
  - 현재 프론트엔드는 **포트 3000**에서 실행됩니다
  - 현재 `.env` 파일에는 `http://localhost:5173`으로 되어있지만, 실제로는 `http://localhost:3000`을 사용해야 합니다
  - **변경 권장**: `http://localhost:5173` → `http://localhost:3000`

### 반드시 수정해야 하는 설정

#### 1. Supabase 설정
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- Supabase 프로젝트 생성 후 실제 값으로 **반드시 변경** 필요

#### 2. Cloudinary 설정
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

- Cloudinary 계정 생성 후 실제 값으로 **반드시 변경** 필요

## 빠른 설정 체크리스트

### 개발 환경에서 수정하지 않아도 되는 항목
- ✅ `PORT=8000` (기본값 사용)
- ✅ `NODE_ENV=development` (기본값 사용)
- ⚠️ `CORS_ORIGIN=http://localhost:3000` (프론트엔드 포트에 맞춰 수정 권장)

### 반드시 수정해야 하는 항목
- ❌ `SUPABASE_URL` → 실제 Supabase 프로젝트 URL
- ❌ `SUPABASE_SERVICE_ROLE_KEY` → 실제 Supabase 서비스 키
- ❌ `CLOUDINARY_CLOUD_NAME` → 실제 Cloudinary 클라우드 이름
- ❌ `CLOUDINARY_API_KEY` → 실제 Cloudinary API 키
- ❌ `CLOUDINARY_API_SECRET` → 실제 Cloudinary API 시크릿

## 현재 .env 파일 상태

```env
# Server (기본값 그대로 사용 가능)
PORT=8000
NODE_ENV=development

# CORS (프론트엔드 포트에 맞춰 수정 권장)
CORS_ORIGIN=http://localhost:5173  # → http://localhost:3000 으로 변경 권장

# Supabase (반드시 수정 필요)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary (반드시 수정 필요)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 권장 변경사항

### 1. CORS_ORIGIN 수정 (선택사항이지만 권장)
```bash
# 현재
CORS_ORIGIN=http://localhost:5173

# 변경 권장 (프론트엔드가 실제로 3000 포트에서 실행됨)
CORS_ORIGIN=http://localhost:3000
```

### 2. 포트 변경이 필요한 경우

프론트엔드 포트가 3000이 아닌 경우:
- `frontend/vite.config.ts`에서 포트 확인
- `.env`의 `CORS_ORIGIN`을 실제 프론트엔드 주소로 변경

백엔드 포트가 8000이 아닌 경우:
- `.env`의 `PORT`를 원하는 포트로 변경

## 참고사항

- 현재 백엔드 코드는 CORS를 모든 origin에 허용하도록 설정되어 있습니다 (`app.use(cors())`)
- 따라서 `CORS_ORIGIN`을 변경하지 않아도 동작하지만, 보안을 위해 추후 환경변수로 제한하는 것이 좋습니다
- 개발 환경에서는 기본값으로 사용해도 문제없습니다

