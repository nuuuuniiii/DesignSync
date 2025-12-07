# 데이터베이스 연결 시작하기

이 문서는 DesignSync 프로젝트에 Supabase와 Cloudinary를 연결하는 방법을 **간단히 요약**한 문서입니다.

## 📋 준비물

1. Supabase 계정 (무료)
2. Cloudinary 계정 (무료)
3. 약 1시간의 시간

## 🚀 빠른 시작 (3단계)

### 1단계: 문서 읽기 (10분)

다음 문서를 순서대로 읽어보세요:

1. **[단계별 가이드](./DATABASE_INTEGRATION_STEPS.md)** - 전체 진행 순서
2. **[상세 설정 가이드](./SUPABASE_CLOUDINARY_SETUP.md)** - Supabase와 Cloudinary 설정 방법
3. **[Backend 구현 가이드](./BACKEND_IMPLEMENTATION_GUIDE.md)** - API 구현 방법

### 2단계: 실제 설정 (30분)

1. Supabase 프로젝트 생성
2. Cloudinary 계정 생성
3. 환경변수 설정
4. 의존성 설치
5. 데이터베이스 스키마 생성

### 3단계: 코드 구현 (20분)

1. Backend 설정 파일 생성
2. API 구조 구현
3. Frontend API 연동

## 📚 문서 구조

```
docs/
├── DATABASE_SETUP_README.md (이 파일) ← 여기서 시작!
├── DATABASE_INTEGRATION_STEPS.md (단계별 가이드)
├── SUPABASE_CLOUDINARY_SETUP.md (상세 설정 가이드)
└── BACKEND_IMPLEMENTATION_GUIDE.md (구현 가이드)

backend/
└── migrations/
    └── 001_initial_schema.sql (데이터베이스 스키마)
```

## 🎯 데이터 구조 요약

### 프로젝트 등록 시 필요한 데이터

```
프로젝트 정보:
├── 이름 (name)
├── 설명 (description)
├── 플랫폼 (platform: 'web' | 'app')
├── 카테고리 (category)
├── 상태 (status: 'resolved' | 'unresolved')
└── 피드백 타입 (feedback_types: 다중 선택)
    ├── User Flow
    ├── Interaction Design
    ├── Visual Design
    ├── UX Writing
    ├── Information Architecture
    └── Usability

디자인 정보 (여러 개):
├── 디자인 이름 (design.name)
├── 이미지들 (design_images: Cloudinary에 업로드)
└── 피드백 질문들 (feedback_questions)
    ├── 커스텀 질문 (직접 입력)
    └── 템플릿 질문 (선택)
```

### 피드백 등록 시 필요한 데이터

```
피드백 정보:
├── 프로젝트 ID (project_id)
├── 디자인 ID (design_id)
└── 평가 정보:
    ├── 별점 평가 (feedback_ratings)
    │   └── 각 피드백 타입별 1-5점
    └── 텍스트 피드백 (feedbacks)
        ├── 질문 ID (question_id)
        ├── 화면 번호 (screen_number)
        └── 피드백 내용 (feedback_text)
```

## 🔑 핵심 포인트

### Supabase
- **역할**: PostgreSQL 데이터베이스
- **사용 위치**: Backend에서만 사용 (service_role 키)
- **용도**: 프로젝트, 디자인, 피드백 데이터 저장

### Cloudinary
- **역할**: 이미지 저장소
- **사용 위치**: Backend에서 업로드, Frontend에서 URL로 표시
- **용도**: 디자인 이미지 저장

## ⚠️ 주의사항

1. **환경변수 보안**
   - `.env` 파일은 절대 Git에 커밋하지 마세요
   - `SUPABASE_SERVICE_ROLE_KEY`는 Backend에서만 사용

2. **이미지 업로드**
   - 파일 크기 제한: 10MB (변경 가능)
   - 지원 형식: 이미지 파일만

3. **데이터베이스**
   - 마이그레이션 SQL은 Supabase SQL Editor에서 실행
   - 테이블 생성 후 인덱스도 함께 생성됨

## 🆘 문제 해결

문제가 발생하면 다음을 확인하세요:

1. **환경변수 확인**
   ```bash
   cd backend
   cat .env  # 값이 올바르게 설정되었는지 확인
   ```

2. **의존성 설치 확인**
   ```bash
   cd backend
   npm list @supabase/supabase-js cloudinary
   ```

3. **Supabase 연결 테스트**
   - Dashboard → Table Editor에서 테이블 확인

4. **Cloudinary 연결 테스트**
   - Dashboard → Media Library에서 업로드 테스트

## 📖 다음 단계

1. **[단계별 가이드](./DATABASE_INTEGRATION_STEPS.md)**를 따라 설정 시작
2. 각 단계를 완료할 때마다 체크
3. 문제가 있으면 각 문서의 "문제 해결" 섹션 참고

---

**시작하려면**: [DATABASE_INTEGRATION_STEPS.md](./DATABASE_INTEGRATION_STEPS.md) 문서를 열어보세요!

