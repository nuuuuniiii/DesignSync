# Supabase & Cloudinary 연결 가이드

이 문서는 DesignSync 프로젝트에 Supabase(데이터베이스)와 Cloudinary(이미지 저장)를 연결하는 방법을 단계별로 설명합니다.

## 목차

1. [Supabase 설정](#1-supabase-설정)
2. [Cloudinary 설정](#2-cloudinary-설정)
3. [데이터베이스 스키마 설계](#3-데이터베이스-스키마-설계)
4. [Backend 환경변수 설정](#4-backend-환경변수-설정)
5. [Backend 의존성 설치](#5-backend-의존성-설치)
6. [Database 연결 설정](#6-database-연결-설정)
7. [Cloudinary 업로드 설정](#7-cloudinary-업로드-설정)
8. [API 구조 설계](#8-api-구조-설계)

---

## 1. Supabase 설정

### 1.1 Supabase 프로젝트 생성

1. [Supabase 웹사이트](https://supabase.com)에 접속
2. **New Project** 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (가장 가까운 리전 권장)
5. 프로젝트 생성 완료 대기 (약 2분 소요)

### 1.2 Supabase API 키 확인

1. 프로젝트 대시보드에서 **Settings** → **API** 메뉴로 이동
2. 다음 정보를 확인:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: 클라이언트에서 사용할 공개 키
   - **service_role key**: 백엔드에서만 사용할 비밀 키 (⚠️ 절대 프론트엔드에 노출 금지)

### 1.3 Supabase 데이터베이스 구조 이해

- Supabase는 PostgreSQL 데이터베이스를 사용합니다
- Table Editor에서 테이블 생성 및 관리 가능
- SQL Editor에서 SQL 쿼리 실행 가능

---

## 2. Cloudinary 설정

### 2.1 Cloudinary 계정 생성

1. [Cloudinary 웹사이트](https://cloudinary.com)에 접속
2. **Sign Up** 클릭하여 계정 생성 (무료 플랜 사용 가능)
3. 이메일 인증 완료

### 2.2 Cloudinary Dashboard 정보 확인

1. Cloudinary Dashboard에 접속
2. 다음 정보를 확인:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `your-api-key`
   - **API Secret**: `your-api-secret`

---

## 3. 데이터베이스 스키마 설계

### 3.1 테이블 구조

DesignSync 프로젝트에는 다음 테이블들이 필요합니다:

#### 1. `users` 테이블
사용자 정보를 저장합니다.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `projects` 테이블
프로젝트 정보를 저장합니다.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  platform VARCHAR(10) NOT NULL CHECK (platform IN ('web', 'app')),
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'unresolved' CHECK (status IN ('resolved', 'unresolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `project_feedback_types` 테이블
프로젝트별 선택된 피드백 타입을 저장합니다 (다대다 관계).

```sql
CREATE TABLE project_feedback_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, feedback_type)
);
```

#### 4. `designs` 테이블
프로젝트의 디자인(Design) 정보를 저장합니다.

```sql
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. `design_images` 테이블
디자인별 이미지 정보를 저장합니다.

```sql
CREATE TABLE design_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  screen_number INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. `feedback_questions` 테이블
프로젝트별 피드백 질문을 저장합니다.

```sql
CREATE TABLE feedback_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'custom' CHECK (question_type IN ('custom', 'template')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. `feedbacks` 테이블
피드백 정보를 저장합니다.

```sql
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  design_id UUID REFERENCES designs(id) ON DELETE SET NULL,
  question_id UUID REFERENCES feedback_questions(id) ON DELETE SET NULL,
  screen_number INTEGER,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8. `feedback_ratings` 테이블
피드백별 별점 평가를 저장합니다.

```sql
CREATE TABLE feedback_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES feedbacks(id) ON DELETE CASCADE,
  feedback_type VARCHAR(50) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(feedback_id, feedback_type)
);
```

### 3.2 인덱스 추가

성능 향상을 위한 인덱스:

```sql
-- 프로젝트 조회 성능 향상
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_platform ON projects(platform);

-- 디자인 조회 성능 향상
CREATE INDEX idx_designs_project_id ON designs(project_id);

-- 이미지 조회 성능 향상
CREATE INDEX idx_design_images_design_id ON design_images(design_id);
CREATE INDEX idx_design_images_screen_number ON design_images(screen_number);

-- 피드백 조회 성능 향상
CREATE INDEX idx_feedbacks_project_id ON feedbacks(project_id);
CREATE INDEX idx_feedbacks_design_id ON feedbacks(design_id);
CREATE INDEX idx_feedbacks_user_id ON feedbacks(user_id);
```

### 3.3 RLS (Row Level Security) 설정

Supabase는 기본적으로 RLS를 활성화합니다. 필요한 정책을 설정해야 합니다:

```sql
-- RLS 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로젝트 조회 가능 (공개 프로젝트)
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

-- 프로젝트 소유자만 수정/삭제 가능
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 4. Backend 환경변수 설정

### 4.1 `.env.example` 파일 생성

`backend/.env.example` 파일을 생성합니다:

```env
# Server
PORT=8000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4.2 `.env` 파일 생성

1. `backend/.env.example`을 복사하여 `backend/.env` 파일 생성
2. 실제 값으로 채우기:
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service_role 키
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary 클라우드 이름
   - `CLOUDINARY_API_KEY`: Cloudinary API 키
   - `CLOUDINARY_API_SECRET`: Cloudinary API 시크릿

⚠️ **주의**: `.env` 파일은 절대 Git에 커밋하지 마세요! `.gitignore`에 포함되어 있는지 확인하세요.

---

## 5. Backend 의존성 설치

필요한 패키지들을 설치합니다:

```bash
cd backend
npm install @supabase/supabase-js cloudinary multer
npm install -D @types/multer
```

설치할 패키지 설명:
- `@supabase/supabase-js`: Supabase JavaScript 클라이언트
- `cloudinary`: Cloudinary SDK
- `multer`: 파일 업로드 처리 미들웨어

---

## 6. Database 연결 설정

### 6.1 Supabase 클라이언트 설정

`backend/src/config/supabase.ts` 파일 생성:

```typescript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

// 서버 사이드에서만 사용하는 클라이언트 (service_role 키 사용)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
```

### 6.2 Cloudinary 설정

`backend/src/config/cloudinary.ts` 파일 생성:

```typescript
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
```

---

## 7. Cloudinary 업로드 설정

### 7.1 이미지 업로드 유틸리티

`backend/src/utils/uploadImage.ts` 파일 생성:

```typescript
import cloudinary from '../config/cloudinary'
import { UploadApiResponse } from 'cloudinary'

export interface UploadResult {
  url: string
  publicId: string
}

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'designsync'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        } else {
          reject(new Error('Upload failed'))
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw error
  }
}
```

---

## 8. API 구조 설계

### 8.1 디렉토리 구조

```
backend/src/
├── config/
│   ├── supabase.ts
│   └── cloudinary.ts
├── controllers/
│   ├── projects.controller.ts
│   ├── designs.controller.ts
│   ├── feedbacks.controller.ts
│   └── upload.controller.ts
├── routes/
│   ├── projects.routes.ts
│   ├── designs.routes.ts
│   ├── feedbacks.routes.ts
│   └── upload.routes.ts
├── services/
│   ├── projects.service.ts
│   ├── designs.service.ts
│   ├── feedbacks.service.ts
│   └── upload.service.ts
├── types/
│   ├── project.types.ts
│   ├── design.types.ts
│   └── feedback.types.ts
├── middleware/
│   ├── upload.middleware.ts
│   └── error.middleware.ts
└── utils/
    ├── logger.ts
    └── uploadImage.ts
```

### 8.2 주요 API 엔드포인트

#### 프로젝트 관련
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects` - 프로젝트 목록 조회 (필터링 지원)
- `GET /api/projects/:id` - 프로젝트 상세 조회
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제
- `PATCH /api/projects/:id/status` - 프로젝트 상태 변경

#### 디자인 관련
- `POST /api/projects/:projectId/designs` - 디자인 생성
- `GET /api/projects/:projectId/designs` - 디자인 목록 조회
- `PUT /api/designs/:id` - 디자인 수정
- `DELETE /api/designs/:id` - 디자인 삭제

#### 이미지 업로드
- `POST /api/upload/image` - 이미지 업로드 (Cloudinary)
- `DELETE /api/upload/image/:publicId` - 이미지 삭제

#### 피드백 관련
- `POST /api/projects/:projectId/feedbacks` - 피드백 생성
- `GET /api/projects/:projectId/feedbacks` - 피드백 목록 조회
- `GET /api/feedbacks/:id` - 피드백 상세 조회
- `PUT /api/feedbacks/:id` - 피드백 수정
- `DELETE /api/feedbacks/:id` - 피드백 삭제

---

## 다음 단계

이제 기본 설정이 완료되었습니다. 다음 문서를 참고하여 구현을 진행하세요:

1. [데이터베이스 마이그레이션 가이드](./DATABASE_MIGRATION.md) - Supabase에 테이블 생성
2. [Backend API 구현 가이드](./BACKEND_API_IMPLEMENTATION.md) - API 엔드포인트 구현
3. [Frontend API 연동 가이드](./FRONTEND_API_INTEGRATION.md) - 프론트엔드에서 API 호출

---

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Cloudinary 공식 문서](https://cloudinary.com/documentation)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)

