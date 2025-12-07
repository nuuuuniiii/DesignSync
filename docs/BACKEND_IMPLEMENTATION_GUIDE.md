# Backend API 구현 가이드

이 문서는 Supabase와 Cloudinary를 사용한 Backend API 구현 방법을 단계별로 설명합니다.

## 목차

1. [프로젝트 구조 설정](#1-프로젝트-구조-설정)
2. [Type 정의](#2-type-정의)
3. [Service 레이어 구현](#3-service-레이어-구현)
4. [Controller 레이어 구현](#4-controller-레이어-구현)
5. [Route 설정](#5-route-설정)
6. [미들웨어 설정](#6-미들웨어-설정)

---

## 1. 프로젝트 구조 설정

### 1.1 디렉토리 생성

```bash
cd backend/src
mkdir -p config controllers routes services types middleware utils
```

### 1.2 설정 파일 생성

이미 `docs/SUPABASE_CLOUDINARY_SETUP.md`에서 설명한 대로 다음 파일들을 생성합니다:
- `config/supabase.ts`
- `config/cloudinary.ts`
- `utils/uploadImage.ts`

---

## 2. Type 정의

### 2.1 `types/project.types.ts`

```typescript
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

export interface CreateProjectRequest {
  name: string
  description?: string
  platform: 'web' | 'app'
  category: string
  feedback_types: string[]
  designs: CreateDesignRequest[]
  questions: CreateQuestionRequest[]
}

export interface CreateDesignRequest {
  name: string
  images: File[]
}

export interface CreateQuestionRequest {
  question_text: string
  question_type: 'custom' | 'template'
  design_id?: string
}
```

### 2.2 `types/design.types.ts`

```typescript
export interface Design {
  id: string
  project_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface DesignImage {
  id: string
  design_id: string
  cloudinary_url: string
  cloudinary_public_id: string
  screen_number: number | null
  display_order: number
  created_at: string
}
```

### 2.3 `types/feedback.types.ts`

```typescript
export interface Feedback {
  id: string
  project_id: string
  user_id: string | null
  design_id: string | null
  question_id: string | null
  screen_number: number | null
  feedback_text: string | null
  created_at: string
  updated_at: string
}

export interface FeedbackRating {
  id: string
  feedback_id: string
  feedback_type: string
  rating: number
  created_at: string
}

export interface CreateFeedbackRequest {
  project_id: string
  design_id?: string
  ratings: Record<string, number> // { 'User Flow': 4, 'Visual Design': 3, ... }
  feedbacks: Array<{
    question_id: string
    screen_number: number
    feedback_text: string
  }>
}
```

---

## 3. Service 레이어 구현

Service 레이어는 비즈니스 로직을 담당합니다.

### 3.1 `services/projects.service.ts` 예시

```typescript
import { supabaseAdmin } from '../config/supabase'
import { Project, CreateProjectRequest } from '../types/project.types'

export class ProjectsService {
  async createProject(data: CreateProjectRequest, userId: string): Promise<Project> {
    // 1. 프로젝트 생성
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description || null,
        platform: data.platform,
        category: data.category,
        status: 'unresolved',
      })
      .select()
      .single()

    if (projectError) throw projectError

    // 2. 피드백 타입 저장
    if (data.feedback_types.length > 0) {
      const feedbackTypesData = data.feedback_types.map((type) => ({
        project_id: project.id,
        feedback_type: type,
      }))

      const { error: typesError } = await supabaseAdmin
        .from('project_feedback_types')
        .insert(feedbackTypesData)

      if (typesError) throw typesError
    }

    // 3. 디자인 및 질문은 별도 API로 처리 (이미지 업로드 포함)

    return project
  }

  async getProjects(filters?: {
    platform?: 'web' | 'app'
    category?: string
    status?: 'resolved' | 'unresolved'
    userId?: string
  }): Promise<Project[]> {
    let query = supabaseAdmin.from('projects').select('*')

    if (filters?.platform) {
      query = query.eq('platform', filters.platform)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

export const projectsService = new ProjectsService()
```

---

## 4. Controller 레이어 구현

Controller는 HTTP 요청/응답을 처리합니다.

### 4.1 `controllers/projects.controller.ts` 예시

```typescript
import { Request, Response } from 'express'
import { projectsService } from '../services/projects.service'
import { CreateProjectRequest } from '../types/project.types'
import { logger } from '../utils/logger'

export class ProjectsController {
  async createProject(req: Request, res: Response) {
    try {
      const projectData: CreateProjectRequest = req.body
      const userId = req.body.user_id || 'temp-user-id' // TODO: 인증 구현 후 실제 user_id 사용

      const project = await projectsService.createProject(projectData, userId)

      res.status(201).json({
        success: true,
        data: project,
      })
    } catch (error: any) {
      logger.error('Error creating project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create project',
      })
    }
  }

  async getProjects(req: Request, res: Response) {
    try {
      const filters = {
        platform: req.query.platform as 'web' | 'app' | undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as 'resolved' | 'unresolved' | undefined,
        userId: req.query.userId as string | undefined,
      }

      const projects = await projectsService.getProjects(filters)

      res.json({
        success: true,
        data: projects,
      })
    } catch (error: any) {
      logger.error('Error fetching projects:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch projects',
      })
    }
  }

  async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const project = await projectsService.getProjectById(id)

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        })
      }

      res.json({
        success: true,
        data: project,
      })
    } catch (error: any) {
      logger.error('Error fetching project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch project',
      })
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      const updates = req.body

      const project = await projectsService.updateProject(id, updates)

      res.json({
        success: true,
        data: project,
      })
    } catch (error: any) {
      logger.error('Error updating project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update project',
      })
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params
      await projectsService.deleteProject(id)

      res.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error: any) {
      logger.error('Error deleting project:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete project',
      })
    }
  }
}

export const projectsController = new ProjectsController()
```

---

## 5. Route 설정

### 5.1 `routes/projects.routes.ts`

```typescript
import { Router } from 'express'
import { projectsController } from '../controllers/projects.controller'

const router = Router()

router.post('/', (req, res) => projectsController.createProject(req, res))
router.get('/', (req, res) => projectsController.getProjects(req, res))
router.get('/:id', (req, res) => projectsController.getProjectById(req, res))
router.put('/:id', (req, res) => projectsController.updateProject(req, res))
router.delete('/:id', (req, res) => projectsController.deleteProject(req, res))

export default router
```

### 5.2 `index.ts`에 라우트 등록

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import projectsRoutes from './routes/projects.routes'
// ... 다른 라우트들

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DesignSync API Server' })
})

// API routes
app.use('/api/projects', projectsRoutes)
// ... 다른 라우트들

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.message, { stack: err.stack })
  res.status(500).json({ error: 'Internal server error' })
})

// ... 서버 시작 코드
```

---

## 6. 미들웨어 설정

### 6.1 파일 업로드 미들웨어

`middleware/upload.middleware.ts`:

```typescript
import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})
```

---

## 다음 단계

이제 기본 구조가 완성되었습니다. 각 서비스와 컨트롤러를 완전히 구현하고, 프론트엔드와 연동하세요.

추가 구현이 필요한 항목:
1. 이미지 업로드 API 완성
2. 디자인 및 질문 관리 API
3. 피드백 생성 및 조회 API
4. 에러 핸들링 개선
5. 인증/인가 구현

