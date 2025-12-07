# 데이터베이스 예시 데이터 가이드

이 문서는 DesignSync 프로젝트의 데이터베이스 구조와 예시 데이터 입력 방법을 설명합니다.

## 📋 테이블 구조 요약

### 1. **projects** 테이블
프로젝트 기본 정보를 저장합니다.

```sql
-- 예시: 프로젝트 생성
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '사용자_UUID',  -- users 테이블의 id
  'Toss Redesign Project',
  'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.',
  'app',  -- 'web' 또는 'app'
  'Finance',  -- E-Commerce, Business, Lifestyle, Media, Finance, Technology, Social, Government, Entertainment, Wellness, Education, Travel 중 하나
  'unresolved'  -- 'resolved' 또는 'unresolved'
);
```

### 2. **project_feedback_types** 테이블
프로젝트별 선택한 피드백 타입을 저장합니다.

```sql
-- 예시: 피드백 타입 저장 (다중선택)
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('프로젝트_UUID', 'User Flow'),
  ('프로젝트_UUID', 'Interaction Design'),
  ('프로젝트_UUID', 'Visual Design');
```

**가능한 피드백 타입:**
- `User Flow`
- `Interaction Design`
- `Visual Design`
- `UX Writing`
- `Information Architecture`
- `Usability`

### 3. **designs** 테이블
프로젝트별 디자인(Your Designs에 입력한 텍스트)을 저장합니다.

```sql
-- 예시: 디자인 생성
INSERT INTO designs (project_id, name)
VALUES 
  ('프로젝트_UUID', 'Login'),  -- Your Designs에 입력한 텍스트
  ('프로젝트_UUID', 'Home'),
  ('프로젝트_UUID', 'Explore');
```

### 4. **design_images** 테이블
디자인별 이미지를 저장합니다.

```sql
-- 예시: 이미지 저장
INSERT INTO design_images (design_id, cloudinary_url, cloudinary_public_id, screen_number, display_order)
VALUES 
  ('디자인_UUID', 'https://res.cloudinary.com/.../image1.jpg', 'projects/.../image1', 1, 0),
  ('디자인_UUID', 'https://res.cloudinary.com/.../image2.jpg', 'projects/.../image2', 2, 1),
  ('디자인_UUID', 'https://res.cloudinary.com/.../image3.jpg', 'projects/.../image3', 3, 2);
```

### 5. **feedback_questions** 테이블
디자인별 피드백 질문을 저장합니다.

```sql
-- 예시: 커스텀 질문 저장
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('프로젝트_UUID', '디자인_UUID', 'What: 무엇이 문제인가요?', 'custom', NULL, 0),
  ('프로젝트_UUID', '디자인_UUID', 'Why: 왜 문제가 되나요?', 'custom', NULL, 1),
  ('프로젝트_UUID', '디자인_UUID', 'How: 어떻게 개선하면 좋을까요?', 'custom', NULL, 2);

-- 예시: 템플릿 질문 저장
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('프로젝트_UUID', '디자인_UUID', '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?', 'template', 'usability', 3),
  ('프로젝트_UUID', '디자인_UUID', '작업을 수행할 때 단계가 명확했다고 느꼈나요?', 'template', 'usability', 4);
```

**question_type:**
- `custom`: 사용자가 직접 입력한 질문
- `template`: 템플릿에서 선택한 질문

## 📝 완전한 예시 데이터 입력 시나리오

### 시나리오: "Toss Redesign Project" 생성

```sql
-- 1. 프로젝트 생성
INSERT INTO projects (user_id, name, description, platform, category, status)
VALUES (
  '사용자_UUID',
  'Toss Redesign Project',
  'Streamlining key tasks to reduce friction and make financial actions faster and more intuitive.',
  'app',
  'Finance',
  'unresolved'
)
RETURNING id;
-- 반환된 프로젝트 ID를 '프로젝트_UUID'에 저장

-- 2. 피드백 타입 저장
INSERT INTO project_feedback_types (project_id, feedback_type)
VALUES 
  ('프로젝트_UUID', 'User Flow'),
  ('프로젝트_UUID', 'Interaction Design'),
  ('프로젝트_UUID', 'Visual Design');

-- 3. 디자인 생성
INSERT INTO designs (project_id, name)
VALUES 
  ('프로젝트_UUID', 'Login')
RETURNING id;
-- 반환된 디자인 ID를 '디자인_UUID'에 저장

-- 4. 이미지 저장
INSERT INTO design_images (design_id, cloudinary_url, cloudinary_public_id, screen_number, display_order)
VALUES 
  ('디자인_UUID', 'https://res.cloudinary.com/.../login1.jpg', 'projects/.../login1', 1, 0),
  ('디자인_UUID', 'https://res.cloudinary.com/.../login2.jpg', 'projects/.../login2', 2, 1);

-- 5. 질문 저장
INSERT INTO feedback_questions (project_id, design_id, question_text, question_type, question_category, display_order)
VALUES 
  ('프로젝트_UUID', '디자인_UUID', 'What: 무엇이 문제인가요?', 'custom', NULL, 0),
  ('프로젝트_UUID', '디자인_UUID', '"다음에 무엇을 해야 하는지" 바로 파악할 수 있었나요?', 'template', 'usability', 1);
```

## 🔍 데이터 조회 예시

### 프로젝트 상세 정보 조회 (모든 관련 데이터 포함)

```sql
-- 프로젝트 기본 정보
SELECT * FROM projects WHERE id = '프로젝트_UUID';

-- 피드백 타입 목록
SELECT feedback_type FROM project_feedback_types 
WHERE project_id = '프로젝트_UUID';

-- 디자인 목록
SELECT * FROM designs WHERE project_id = '프로젝트_UUID';

-- 특정 디자인의 이미지 목록
SELECT * FROM design_images 
WHERE design_id = '디자인_UUID'
ORDER BY display_order;

-- 특정 디자인의 질문 목록
SELECT * FROM feedback_questions 
WHERE design_id = '디자인_UUID'
ORDER BY display_order;
```

## ⚠️ 주의사항

1. **외래키 관계**: 
   - `project_id`는 `projects` 테이블에 존재해야 함
   - `design_id`는 `designs` 테이블에 존재해야 함
   - `user_id`는 `users` 테이블에 존재해야 함

2. **카테고리 값**: 정확한 값을 사용해야 함 (대소문자 구분)
   - `'E-Commerce'` (정확한 값)
   - `'ecommerce'` (오류)

3. **피드백 타입 값**: 정확한 값을 사용해야 함
   - `'User Flow'` (정확한 값)
   - `'user flow'` (오류)

4. **UUID 형식**: 모든 ID는 UUID 형식이어야 함
   - 예: `'550e8400-e29b-41d4-a716-446655440000'`

## 📊 데이터 흐름

```
1. 프로젝트 생성 (projects)
   ↓
2. 피드백 타입 저장 (project_feedback_types)
   ↓
3. 디자인 생성 (designs)
   ↓
4. 이미지 저장 (design_images) + 질문 저장 (feedback_questions)
```

## 🔗 테이블 관계도

```
users
  └─ projects (user_id)
      ├─ project_feedback_types (project_id)
      └─ designs (project_id)
          ├─ design_images (design_id)
          └─ feedback_questions (design_id)
```

