# 데이터베이스 스키마 문서

## 개요
DesignSync 프로젝트의 데이터베이스 스키마는 PostgreSQL을 기반으로 하며, 모든 컬럼명과 테이블명은 **snake_case**를 사용합니다.

## 테이블 구조

### 1. users (사용자)
사용자 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 주소 |
| name | VARCHAR(255) | | 사용자 이름 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 수정 시간 |

### 2. projects (프로젝트)
프로젝트 기본 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 프로젝트 고유 ID |
| user_id | UUID | FOREIGN KEY → users(id) | 프로젝트 소유자 ID |
| name | VARCHAR(255) | NOT NULL | 프로젝트 이름 |
| description | TEXT | | 프로젝트 설명 |
| platform | VARCHAR(10) | NOT NULL, CHECK | 플랫폼 타입 ('web' 또는 'app') |
| category | VARCHAR(50) | NOT NULL, CHECK | 카테고리 (E-Commerce, Business, Lifestyle 등) |
| status | VARCHAR(20) | DEFAULT 'unresolved', CHECK | 상태 ('resolved' 또는 'unresolved') |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 수정 시간 |

**카테고리 목록:**
- E-Commerce
- Business
- Lifestyle
- Media
- Finance
- Technology
- Social
- Government
- Entertainment
- Wellness
- Education
- Travel

### 3. project_feedback_types (프로젝트 피드백 유형)
프로젝트별로 선택된 피드백 유형을 저장하는 다대다 관계 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 고유 ID |
| project_id | UUID | FOREIGN KEY → projects(id) | 프로젝트 ID |
| feedback_type | VARCHAR(50) | NOT NULL, CHECK | 피드백 유형 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |

**피드백 유형 목록:**
- User Flow
- Interaction Design
- Visual Design
- UX Writing
- Information Architecture
- Usability

**제약조건:** `UNIQUE(project_id, feedback_type)` - 한 프로젝트에 동일한 피드백 유형은 중복 불가

### 4. designs (디자인)
프로젝트별 디자인 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 디자인 고유 ID |
| project_id | UUID | FOREIGN KEY → projects(id) | 프로젝트 ID |
| name | VARCHAR(255) | NOT NULL | 디자인 이름 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 수정 시간 |

### 5. design_images (디자인 이미지)
디자인별 이미지 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 이미지 고유 ID |
| design_id | UUID | FOREIGN KEY → designs(id) | 디자인 ID |
| cloudinary_url | TEXT | NOT NULL | Cloudinary 이미지 URL |
| cloudinary_public_id | VARCHAR(255) | NOT NULL | Cloudinary Public ID |
| screen_number | INTEGER | NOT NULL | 화면 번호 |
| display_order | INTEGER | DEFAULT 0 | 표시 순서 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |

### 6. feedback_questions (피드백 질문)
프로젝트별 또는 디자인별 피드백 질문을 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 질문 고유 ID |
| project_id | UUID | FOREIGN KEY → projects(id) | 프로젝트 ID |
| design_id | UUID | FOREIGN KEY → designs(id) | 디자인 ID (선택적) |
| question_text | TEXT | NOT NULL | 질문 내용 |
| question_type | VARCHAR(20) | DEFAULT 'custom', CHECK | 질문 타입 ('custom' 또는 'template') |
| question_category | VARCHAR(50) | | 질문 카테고리 (Basic Questions, Usability, Design 등) |
| display_order | INTEGER | DEFAULT 0 | 표시 순서 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |

### 7. feedbacks (피드백)
피드백 메인 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 피드백 고유 ID |
| project_id | UUID | FOREIGN KEY → projects(id) | 프로젝트 ID |
| user_id | UUID | FOREIGN KEY → users(id) | 피드백 작성자 ID |
| design_id | UUID | FOREIGN KEY → designs(id) | 디자인 ID (선택적) |
| question_id | UUID | FOREIGN KEY → feedback_questions(id) | 질문 ID (선택적) |
| screen_number | INTEGER | | 화면 번호 |
| feedback_text | TEXT | NOT NULL | 피드백 텍스트 내용 |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 수정 시간 |

### 8. feedback_ratings (피드백 별점)
피드백별 피드백 유형별 별점을 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PRIMARY KEY | 별점 고유 ID |
| feedback_id | UUID | FOREIGN KEY → feedbacks(id) | 피드백 ID |
| feedback_type | VARCHAR(50) | NOT NULL, CHECK | 피드백 유형 |
| rating | INTEGER | NOT NULL, CHECK | 별점 (1-5점) |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 생성 시간 |

**제약조건:** 
- `rating >= 1 AND rating <= 5` - 별점은 1점부터 5점까지
- `UNIQUE(feedback_id, feedback_type)` - 한 피드백에 동일한 피드백 유형의 별점은 중복 불가

## 인덱스

성능 최적화를 위해 다음 인덱스가 생성됩니다:

- `idx_projects_user_id` - projects.user_id
- `idx_projects_status` - projects.status
- `idx_projects_category` - projects.category
- `idx_projects_platform` - projects.platform
- `idx_project_feedback_types_project_id` - project_feedback_types.project_id
- `idx_designs_project_id` - designs.project_id
- `idx_design_images_design_id` - design_images.design_id
- `idx_design_images_screen_number` - design_images.screen_number
- `idx_feedback_questions_project_id` - feedback_questions.project_id
- `idx_feedback_questions_design_id` - feedback_questions.design_id
- `idx_feedbacks_project_id` - feedbacks.project_id
- `idx_feedbacks_design_id` - feedbacks.design_id
- `idx_feedbacks_user_id` - feedbacks.user_id
- `idx_feedbacks_question_id` - feedbacks.question_id
- `idx_feedback_ratings_feedback_id` - feedback_ratings.feedback_id

## 트리거

`updated_at` 컬럼을 자동으로 업데이트하는 트리거가 다음 테이블에 설정됩니다:

- `projects`
- `designs`
- `feedbacks`
- `users`

## 관계도

```
users
  └── projects (1:N)
      ├── project_feedback_types (1:N)
      ├── designs (1:N)
      │   ├── design_images (1:N)
      │   └── feedback_questions (1:N)
      ├── feedback_questions (1:N)
      └── feedbacks (1:N)
          ├── feedback_ratings (1:N)
          └── designs (N:1)
```

## 사용 예시

### 프로젝트 등록 플로우
1. `projects` 테이블에 프로젝트 기본 정보 저장
2. `project_feedback_types` 테이블에 선택된 피드백 유형 저장
3. `designs` 테이블에 디자인 정보 저장
4. `design_images` 테이블에 디자인별 이미지 저장
5. `feedback_questions` 테이블에 질문 저장

### 피드백 등록 플로우
1. `feedbacks` 테이블에 피드백 기본 정보 저장
2. `feedback_ratings` 테이블에 피드백 유형별 별점 저장

## 마이그레이션 실행

Supabase SQL Editor에서 `backend/migrations/001_initial_schema.sql` 파일의 내용을 실행하거나, 마이그레이션 도구를 사용하여 실행할 수 있습니다.

