# 데이터베이스 연결 단계별 가이드

이 문서는 DesignSync 프로젝트에 Supabase와 Cloudinary를 연결하는 전체적인 흐름을 단계별로 설명합니다.

## 전체 진행 순서

```
1. Supabase 프로젝트 생성 및 설정
   ↓
2. Cloudinary 계정 생성 및 설정
   ↓
3. 환경변수 파일 생성
   ↓
4. Backend 의존성 설치
   ↓
5. 데이터베이스 스키마 생성
   ↓
6. Backend 설정 파일 생성
   ↓
7. API 구조 구현
   ↓
8. Frontend API 연동
```

---

## 1단계: Supabase 프로젝트 생성 (약 5분)

### 1.1 Supabase 계정 생성
1. https://supabase.com 접속
2. **Start your project** 또는 **Sign Up** 클릭
3. GitHub 계정으로 로그인 (또는 이메일로 가입)

### 1.2 프로젝트 생성
1. Dashboard에서 **New Project** 클릭
2. 다음 정보 입력:
   - **Name**: `designsync` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (복사해서 보관!)
   - **Region**: `Northeast Asia (Seoul)` 또는 가장 가까운 리전
3. **Create new project** 클릭
4. 프로젝트 생성 완료 대기 (약 2분)

### 1.3 API 키 확인
1. 왼쪽 메뉴에서 **Settings** → **API** 클릭
2. 다음 정보 복사해서 메모장에 저장:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (⚠️ 비밀!)
   ```

---

## 2단계: Cloudinary 계정 생성 (약 3분)

### 2.1 계정 생성
1. https://cloudinary.com 접속
2. **Sign Up for Free** 클릭
3. 이메일, 비밀번호, 이름 입력
4. 이메일 인증 완료

### 2.2 API 정보 확인
1. Dashboard 접속
2. 다음 정보 복사해서 메모장에 저장:
   ```
   Cloud name: xxxxx
   API Key: xxxxx
   API Secret: xxxxx
   ```

---

## 3단계: 환경변수 파일 생성 (약 2분)

### 3.1 Backend 환경변수 파일 생성

`backend/.env.example` 파일이 있는지 확인하고, 없다면 생성:

```bash
cd backend
touch .env.example
```

`.env.example` 내용:

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

### 3.2 실제 환경변수 파일 생성

```bash
cp .env.example .env
```

`.env` 파일을 열어서 1단계, 2단계에서 복사한 실제 값으로 채우기:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role 키)
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

⚠️ **중요**: `.env` 파일은 Git에 커밋하지 마세요! `.gitignore`에 포함되어 있는지 확인하세요.

---

## 4단계: Backend 의존성 설치 (약 2분)

### 4.1 패키지 설치

```bash
cd backend
npm install @supabase/supabase-js cloudinary multer
npm install -D @types/multer
```

설치되는 패키지:
- `@supabase/supabase-js`: Supabase 클라이언트 라이브러리
- `cloudinary`: Cloudinary SDK
- `multer`: 파일 업로드 처리 미들웨어
- `@types/multer`: TypeScript 타입 정의

---

## 5단계: 데이터베이스 스키마 생성 (약 5분)

### 5.1 Supabase SQL Editor에서 실행

1. Supabase Dashboard 접속
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New query** 클릭
4. `backend/migrations/001_initial_schema.sql` 파일 내용 복사
5. SQL Editor에 붙여넣기
6. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)
7. 성공 메시지 확인

### 5.2 테이블 생성 확인

1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - `users`
   - `projects`
   - `project_feedback_types`
   - `designs`
   - `design_images`
   - `feedback_questions`
   - `feedbacks`
   - `feedback_ratings`

---

## 6단계: Backend 설정 파일 생성 (약 5분)

다음 파일들을 생성합니다:

### 6.1 `backend/src/config/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
```

### 6.2 `backend/src/config/cloudinary.ts`

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

### 6.3 `backend/src/utils/uploadImage.ts`

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

## 7단계: API 구조 구현 (약 30분)

이 단계는 `docs/BACKEND_IMPLEMENTATION_GUIDE.md`를 참고하여 진행하세요.

주요 작업:
1. Type 정의 파일 생성
2. Service 레이어 구현
3. Controller 레이어 구현
4. Route 설정
5. 미들웨어 설정

---

## 8단계: Frontend API 연동 (약 20분)

Frontend에서 API를 호출하는 코드를 작성합니다.

### 8.1 API 클라이언트 생성

`frontend/src/api/client.ts`:

```typescript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 8.2 API 함수 생성

`frontend/src/api/projects.ts`:

```typescript
import { apiClient } from './client'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  platform: 'web' | 'app'
  category: string
  status: 'resolved' | 'unresolved'
  created_at: string
  updated_at: string
}

export const projectsAPI = {
  create: async (data: any): Promise<Project> => {
    const response = await apiClient.post('/projects', data)
    return response.data.data
  },

  getAll: async (filters?: {
    platform?: 'web' | 'app'
    category?: string
    status?: 'resolved' | 'unresolved'
  }): Promise<Project[]> => {
    const response = await apiClient.get('/projects', { params: filters })
    return response.data.data
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data.data
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  },
}
```

---

## 다음 단계

각 단계를 완료한 후, 다음 문서들을 참고하여 구현을 완성하세요:

1. ✅ [Supabase & Cloudinary 설정 가이드](./SUPABASE_CLOUDINARY_SETUP.md) - 완료
2. ✅ [데이터베이스 스키마 SQL](../backend/migrations/001_initial_schema.sql) - 완료
3. ✅ [Backend 구현 가이드](./BACKEND_IMPLEMENTATION_GUIDE.md) - 완료
4. 📝 Frontend API 연동 예시 (추가 예정)

---

## 문제 해결

### Supabase 연결 오류
- 환경변수가 올바르게 설정되었는지 확인
- `SUPABASE_SERVICE_ROLE_KEY`가 service_role 키인지 확인 (anon key 아님!)

### Cloudinary 업로드 오류
- 환경변수 확인
- 파일 크기 제한 확인 (기본 10MB)

### 데이터베이스 테이블이 보이지 않음
- SQL Editor에서 쿼리 실행이 성공했는지 확인
- Table Editor에서 새로고침

