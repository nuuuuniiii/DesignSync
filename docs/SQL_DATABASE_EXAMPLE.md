# SQL 데이터베이스 예시 데이터 입력 가이드

이 문서는 DesignSync 프로젝트의 데이터베이스에 예시 데이터를 입력하는 방법을 설명합니다.

## 📋 테이블별 데이터 입력 예시

### 1. **users** 테이블
```sql
-- 사용자 생성 (Supabase Auth에서 자동 생성됨)
-- 또는 수동으로 생성:
INSERT INTO users (id, email, name)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',  -- UUID
  'user@example.com',
  '홍길동'
);
```

### 2. **projects** 테이블
프로젝트 기본 정보 저장

```sql
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',  -- users 테이블의 id
  'Toss Redesign Project',  -- 프로젝트 이름
  'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.',  -- 프로젝트 설명
  'app',  -- 'web' 또는 'app'
  'Finance',  -- 카테고리: E-Commerce, Business, Lifestyle, Media, Finance, Technology, Social, Government, Entertainment, Wellness, Education, Travel 중 하나
  'unresolved'  -- 'resolved' 또는 'unresolved'
)
RETURNING id;  -- 생성된 프로젝트 ID를 반환 (다음 단계에서 사용)
```

**카테고리 가능한 값:**
- `E-Commerce`
- `Business`
- `Lifestyle`
- `Media`
- `Finance`
- `Technology`
- `Social`
- `Government`
- `Entertainment`
- `Wellness`
- `Education`
- `Travel`

### 3. **project_feedback_types** 테이블
프로젝트별 선택한 피드백 타입 저장 (다중선택)

```sql
-- 위에서 반환된 프로젝트 ID를 사용
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('프로젝트_UUID', 'User Flow'),
  ('프로젝트_UUID', 'Interaction Design'),
  ('프로젝트_UUID', 'Visual Design');
```

**피드백 타입 가능한 값:**
- `User Flow`
- `Interaction Design`
- `Visual Design`
- `UX Writing`
- `Information Architecture`
- `Usability`

### 4. **designs** 테이블
프로젝트별 디자인 저장 (Your Designs에 입력한 텍스트)

```sql
INSERT INTO designs (project_id, name)
VALUES 
  ('프로젝트_UUID', 'Login'),  -- Your Designs에 입력한 텍스트
  ('프로젝트_UUID', 'Home'),
  ('프로젝트_UUID', 'Explore')
RETURNING id;  -- 생성된 디자인 ID를 반환 (이미지 및 질문 저장 시 사용)
```

### 5. **design_images** 테이블
디자인별 이미지 저장

```sql
-- 위에서 반환된 디자인 ID를 사용
INSERT INTO design_images (design_id, cloudinary_url, cloudinary_public_id, screen_number, display_order)
VALUES 
  ('디자인_UUID', 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/projects/.../login1.jpg', 'projects/project-id/designs/design-id/login1', 1, 0),
  ('디자인_UUID', 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/projects/.../login2.jpg', 'projects/project-id/designs/design-id/login2', 2, 1),
  ('디자인_UUID', 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/projects/.../login3.jpg', 'projects/project-id/designs/design-id/login3', 3, 2);
```

**필드 설명:**
- `cloudinary_url`: Cloudinary에서 제공하는 이미지 URL
- `cloudinary_public_id`: Cloudinary에서 제공하는 Public ID
- `screen_number`: 화면 번호 (1부터 시작)
- `display_order`: 표시 순서 (0부터 시작)

### 6. **feedback_questions** 테이블
디자인별 피드백 질문 저장

#### 커스텀 질문 (직접 입력한 질문)
```sql
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('프로젝트_UUID', '디자인_UUID', 'What: 무엇이 문제인가요?', 'custom', NULL, 0),
  ('프로젝트_UUID', '디자인_UUID', 'Why: 왜 문제가 되나요?', 'custom', NULL, 1),
  ('프로젝트_UUID', '디자인_UUID', 'How: 어떻게 개선하면 좋을까요? (명확한 방향성)', 'custom', NULL, 2);
```

#### 템플릿 질문 (선택한 질문)
```sql
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('프로젝트_UUID', '디자인_UUID', '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?', 'template', 'usability', 3),
  ('프로젝트_UUID', '디자인_UUID', '작업을 수행할 때 단계가 명확했다고 느꼈나요?', 'template', 'usability', 4),
  ('프로젝트_UUID', '디자인_UUID', '화면 간 디자인 요소(버튼, 색상, 인터랙션)가 일관되게 유지되었나요?', 'template', 'design', 5),
  ('프로젝트_UUID', '디자인_UUID', '시선이 불필요하게 분산되거나 먼저 보면 좋을 요소가 묻히는 부분이 있었나요?', 'template', 'design', 6),
  ('프로젝트_UUID', '디자인_UUID', '이 서비스의 목적과 기능을 처음 사용했을 때 직관적으로 이해되었나요? 이해되지 않았다면 어떤 부분이 혼란스러웠나요?', 'template', 'usability', 7),
  ('프로젝트_UUID', '디자인_UUID', '취소/뒤로가기 기능이 잘 보이고 예측 가능했나요?', 'template', 'usability', 8),
  ('프로젝트_UUID', '디자인_UUID', '정보의 흐름과 순서가 실제 사용자 작업 방식과 맞았나요?', 'template', 'usability', 9),
  ('프로젝트_UUID', '디자인_UUID', '서비스에서 사용하는 용어나 개념이 자연스럽고 익숙하게 느껴졌나요?', 'template', 'usability', 10),
  ('프로젝트_UUID', '디자인_UUID', '사용 중 현재 상태나 진행 상황이 명확하게 보였나요?', 'template', 'usability', 11),
  ('프로젝트_UUID', '디자인_UUID', '액션 후 시스템에서 제공하는 피드백(알림·메시지·애니메이션)이 명확했나요?', 'template', 'usability', 12),
  ('프로젝트_UUID', '디자인_UUID', '입력 필드에서 실수를 유발하는 요소가 있었나요?', 'template', 'usability', 13),
  ('프로젝트_UUID', '디자인_UUID', '필요한 옵션이나 정보가 화면에 충분히 드러나 있었나요?', 'template', 'usability', 14),
  ('프로젝트_UUID', '디자인_UUID', '숙련자와 초보자 모두 편리하게 사용할 수 있다고 느꼈나요?', 'template', 'usability', 15),
  ('프로젝트_UUID', '디자인_UUID', '오류 메시지가 문제 원인을 명확히 설명했나요?', 'template', 'usability', 16);
```

**question_type 가능한 값:**
- `custom`: 사용자가 직접 입력한 질문
- `template`: 템플릿에서 선택한 질문

**question_category 가능한 값:**
- `basic`: Basic Questions
- `usability`: Usability
- `design`: Design
- `NULL`: 카테고리 없음

## 📝 완전한 예시 데이터 입력 시나리오

### 시나리오: "Toss Redesign Project" 전체 등록

```sql
-- 1단계: 프로젝트 생성
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',  -- 실제 사용자 UUID로 변경
  'Toss Redesign Project',
  'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.',
  'app',
  'Finance',
  'unresolved'
)
RETURNING id;
-- 결과: 프로젝트 ID를 복사 (예: '660e8400-e29b-41d4-a716-446655440001')

-- 2단계: 피드백 타입 저장
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'User Flow'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Interaction Design'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Visual Design');

-- 3단계: 디자인 생성 (Login)
INSERT INTO designs (project_id, name)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'Login')
RETURNING id;
-- 결과: 디자인 ID를 복사 (예: '770e8400-e29b-41d4-a716-446655440002')

-- 4단계: Login 디자인의 이미지 저장
INSERT INTO design_images (design_id, cloudinary_url, cloudinary_public_id, screen_number, display_order)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440002', 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/projects/660e8400/designs/770e8400/login1.jpg', 'projects/660e8400/designs/770e8400/login1', 1, 0),
  ('770e8400-e29b-41d4-a716-446655440002', 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/projects/660e8400/designs/770e8400/login2.jpg', 'projects/660e8400/designs/770e8400/login2', 2, 1);

-- 5단계: Login 디자인의 질문 저장
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'What: 무엇이 문제인가요?', 'custom', NULL, 0),
  ('660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?', 'template', 'usability', 1);

-- 6단계: 두 번째 디자인 생성 (Home)
INSERT INTO designs (project_id, name)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'Home')
RETURNING id;
-- 결과: 디자인 ID를 복사 (예: '880e8400-e29b-41d4-a716-446655440003')

-- 7단계: Home 디자인의 이미지 및 질문 저장
-- (동일한 방식으로 반복)
```

## 🔍 데이터 조회 예시

### 프로젝트 상세 정보 조회

```sql
-- 프로젝트 기본 정보
SELECT * FROM projects WHERE id = '프로젝트_UUID';

-- 피드백 타입 목록
SELECT feedback_type FROM project_feedback_types 
WHERE project_id = '프로젝트_UUID'
ORDER BY created_at;

-- 디자인 목록
SELECT id, name, created_at FROM designs 
WHERE project_id = '프로젝트_UUID'
ORDER BY created_at;

-- 특정 디자인의 이미지 목록
SELECT id, cloudinary_url, screen_number, display_order 
FROM design_images 
WHERE design_id = '디자인_UUID'
ORDER BY display_order;

-- 특정 디자인의 질문 목록
SELECT id, question_text, question_type, question_category, display_order 
FROM feedback_questions 
WHERE design_id = '디자인_UUID'
ORDER BY display_order;
```

### 전체 프로젝트 정보 조회 (JOIN 사용)

```sql
-- 프로젝트 + 피드백 타입
SELECT 
  p.*,
  array_agg(DISTINCT pft.feedback_type) as feedback_types
FROM projects p
LEFT JOIN project_feedback_types pft ON p.id = pft.project_id
WHERE p.id = '프로젝트_UUID'
GROUP BY p.id;

-- 프로젝트 + 디자인 + 이미지
SELECT 
  p.name as project_name,
  d.name as design_name,
  di.cloudinary_url,
  di.screen_number
FROM projects p
JOIN designs d ON p.id = d.project_id
LEFT JOIN design_images di ON d.id = di.design_id
WHERE p.id = '프로젝트_UUID'
ORDER BY d.created_at, di.display_order;

-- 프로젝트 + 디자인 + 질문
SELECT 
  p.name as project_name,
  d.name as design_name,
  fq.question_text,
  fq.question_type,
  fq.display_order
FROM projects p
JOIN designs d ON p.id = d.project_id
LEFT JOIN feedback_questions fq ON d.id = fq.design_id
WHERE p.id = '프로젝트_UUID'
ORDER BY d.created_at, fq.display_order;
```

## ⚠️ 중요 주의사항

1. **UUID 형식**: 모든 ID는 UUID 형식이어야 합니다
   ```sql
   -- 올바른 형식
   '550e8400-e29b-41d4-a716-446655440000'
   
   -- 잘못된 형식
   '550e8400e29b41d4a716446655440000'  -- 하이픈 없음
   '550e8400'  -- 너무 짧음
   ```

2. **카테고리 값 정확성**: 대소문자와 하이픈을 정확히 입력
   ```sql
   -- 올바른 값
   'E-Commerce'  ✅
   'Finance'     ✅
   
   -- 잘못된 값
   'ecommerce'   ❌
   'Ecommerce'   ❌
   'e-commerce'  ❌
   ```

3. **피드백 타입 값 정확성**: 공백과 대소문자 정확히 입력
   ```sql
   -- 올바른 값
   'User Flow'              ✅
   'Interaction Design'     ✅
   'Information Architecture' ✅
   
   -- 잘못된 값
   'user flow'              ❌
   'UserFlow'               ❌
   'user-flow'              ❌
   ```

4. **외래키 제약조건**: 관련 테이블이 먼저 생성되어야 함
   - `project_id` → `projects` 테이블에 존재해야 함
   - `design_id` → `designs` 테이블에 존재해야 함
   - `user_id` → `users` 테이블에 존재해야 함

5. **순서**: 데이터를 올바른 순서로 입력해야 함
   ```
   1. users (이미 Supabase Auth에서 생성됨)
   2. projects
   3. project_feedback_types
   4. designs
   5. design_images
   6. feedback_questions
   ```

## 📊 데이터 구조 다이어그램

```
users
  │
  └─ projects
      ├─ project_feedback_types (다중 선택)
      │
      └─ designs (Your Designs에 입력한 텍스트)
          ├─ design_images (디자인별 이미지)
          └─ feedback_questions (디자인별 질문)
              ├─ custom (직접 입력한 질문)
              └─ template (템플릿에서 선택한 질문)
```

## 💡 실제 사용 예시

### 예시 1: 간단한 프로젝트 등록

```sql
-- 프로젝트 생성
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '사용자_UUID',
  'My App Project',
  'A simple mobile app project',
  'app',
  'Technology',
  'unresolved'
)
RETURNING id;

-- 피드백 타입 (2개만 선택)
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('프로젝트_UUID', 'User Flow'),
  ('프로젝트_UUID', 'Usability');

-- 디자인 1개
INSERT INTO designs (project_id, name)
VALUES ('프로젝트_UUID', 'Main Screen')
RETURNING id;

-- 이미지 1개
INSERT INTO design_images (design_id, cloudinary_url, cloudinary_public_id, screen_number, display_order)
VALUES ('디자인_UUID', 'https://...', 'projects/.../image1', 1, 0);

-- 질문 1개
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, display_order)
VALUES ('프로젝트_UUID', '디자인_UUID', 'What: 무엇이 문제인가요?', 'custom', 0);
```

### 예시 2: 복잡한 프로젝트 등록

```sql
-- 프로젝트 생성
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '사용자_UUID',
  'E-commerce Platform',
  'Full-featured e-commerce platform with multiple screens',
  'web',
  'E-Commerce',
  'unresolved'
)
RETURNING id;

-- 피드백 타입 (6개 모두 선택)
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('프로젝트_UUID', 'User Flow'),
  ('프로젝트_UUID', 'Interaction Design'),
  ('프로젝트_UUID', 'Visual Design'),
  ('프로젝트_UUID', 'UX Writing'),
  ('프로젝트_UUID', 'Information Architecture'),
  ('프로젝트_UUID', 'Usability');

-- 디자인 1: Login
INSERT INTO designs (project_id, name) VALUES ('프로젝트_UUID', 'Login') RETURNING id;
-- 디자인 2: Product List
INSERT INTO designs (project_id, name) VALUES ('프로젝트_UUID', 'Product List') RETURNING id;
-- 디자인 3: Checkout
INSERT INTO designs (project_id, name) VALUES ('프로젝트_UUID', 'Checkout') RETURNING id;

-- 각 디자인별로 이미지와 질문 추가...
```

## 🔗 관련 문서

- [데이터베이스 스키마](./001_initial_schema.sql) - 전체 테이블 구조
- [데이터베이스 통합 가이드](./DATABASE_INTEGRATION_STEPS.md) - API 연동 방법

