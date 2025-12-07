# 데이터베이스 구조 요약

## ✅ 프로젝트 등록 시 저장되는 데이터

### 1. 프로젝트 기본 정보 → `projects` 테이블
- 프로젝트 이름 (`name`)
- 프로젝트 설명 (`description`)
- App/Web 선택 (`platform`: 'web' 또는 'app')
- 카테고리 선택 (`category`: E-Commerce, Business, Lifestyle, etc.)
- 상태 (`status`: 'resolved' 또는 'unresolved')

### 2. 피드백 타입 → `project_feedback_types` 테이블
- Desired Feedback Type 다중선택
- 가능한 값:
  - User Flow
  - Interaction Design
  - Visual Design
  - UX Writing
  - Information Architecture
  - Usability

### 3. 디자인 (Your Designs) → `designs` 테이블
- Design Name (= Your Designs에 입력한 텍스트)
- 예: "Login", "Home", "Explore"

### 4. 디자인별 이미지 → `design_images` 테이블
- 각 디자인별로 여러 이미지 저장
- Cloudinary URL 저장
- 화면 번호 (`screen_number`)
- 표시 순서 (`display_order`)

### 5. 디자인별 질문 → `feedback_questions` 테이블
- 커스텀 질문 (직접 입력)
- 템플릿 질문 (선택)
- 디자인별로 여러 질문 저장 가능
- 표시 순서 (`display_order`)

---

## ✅ Project Detail 화면에서 표시되는 데이터

### 1. Designs 텍스트
- **출처**: `designs` 테이블의 `name` 필드
- **표시**: 디자인 목록 버튼으로 표시

### 2. Designs별 선택
- 프론트엔드에서 구현
- 사용자가 디자인 버튼 클릭 시 해당 디자인의 데이터만 표시

### 3. Design별 이미지
- **출처**: `design_images` 테이블
- **조건**: `design_id`로 필터링
- **정렬**: `display_order` 순서대로

### 4. Design Name
- **출처**: `designs.name` (Your Designs에 입력한 텍스트)
- **표시**: 선택한 디자인의 이름 표시

### 5. Feedback Question
- **출처**: `feedback_questions` 테이블
- **조건**: `design_id`로 필터링
- **정렬**: `display_order` 순서대로
- **타입**: 
  - `custom`: 직접 입력한 질문
  - `template`: 템플릿에서 선택한 질문

### 6. 선택한 피드백 타입만 별점 표시
- **출처**: `project_feedback_types` 테이블
- **로직**: 프로젝트 등록 시 선택한 피드백 타입만 필터링하여 별점 표시
- 전체 6개 타입 중 선택한 타입만 표시

---

## 📊 데이터 흐름도

```
프로젝트 등록
    ↓
1. projects 테이블에 프로젝트 정보 저장
    ↓
2. project_feedback_types 테이블에 선택한 피드백 타입 저장
    ↓
3. designs 테이블에 디자인 이름 저장 (Your Designs)
    ↓
4. design_images 테이블에 디자인별 이미지 저장
    ↓
5. feedback_questions 테이블에 디자인별 질문 저장
    ↓
프로젝트 상세 조회
    ↓
1. projects 테이블에서 프로젝트 정보 조회
    ↓
2. project_feedback_types 테이블에서 피드백 타입 조회
    ↓
3. designs 테이블에서 디자인 목록 조회
    ↓
4. design_images 테이블에서 선택한 디자인의 이미지 조회
    ↓
5. feedback_questions 테이블에서 선택한 디자인의 질문 조회
    ↓
화면 표시
    - Designs 목록 표시
    - 선택한 디자인의 이미지 표시
    - 선택한 디자인의 질문 표시
    - 선택한 피드백 타입만 별점 표시
```

---

## 🔗 테이블 관계도

```
users
  │
  └─ projects (user_id)
      ├─ project_feedback_types (project_id) ← 선택한 피드백 타입
      │
      └─ designs (project_id) ← Your Designs에 입력한 텍스트
          ├─ design_images (design_id) ← 디자인별 이미지
          └─ feedback_questions (design_id) ← 디자인별 질문
```

---

## ✅ 확인 사항

### 백엔드 API
- ✅ `POST /api/projects` - 프로젝트 생성
- ✅ `POST /api/projects/:id/designs` - 디자인 및 이미지, 질문 생성
- ✅ `GET /api/projects/:id/details` - 프로젝트 상세 정보 조회
  - 프로젝트 정보
  - 피드백 타입 목록
  - 디자인 목록
  - 각 디자인의 이미지 목록
  - 각 디자인의 질문 목록

### 프론트엔드
- ✅ 프로젝트 등록 시 모든 데이터 저장
- ✅ 프로젝트 상세 조회 시 모든 데이터 표시
- ✅ 선택한 피드백 타입만 별점 표시
- ✅ 디자인별 이미지, 질문 표시

---

## 💡 요약

**네, 맞습니다!** 

데이터베이스 구조가 요구사항을 모두 충족하도록 구성되어 있습니다:

1. ✅ 프로젝트 등록 시 입력한 모든 값이 저장됨
2. ✅ Project Detail에서 Designs 텍스트 표시
3. ✅ Designs별로 선택 가능
4. ✅ 선택한 Design의 이미지, Design Name, Feedback Question 표시
5. ✅ Desired Feedback Type 중 선택한 것만 별점 표시

