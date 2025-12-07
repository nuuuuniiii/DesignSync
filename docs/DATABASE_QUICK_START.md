# 🚀 데이터베이스 연결 빠른 시작 가이드

## 📖 문서 읽는 순서

1. **[DATABASE_SETUP_README.md](./DATABASE_SETUP_README.md)** ← 여기서 시작!
   - 전체 개요와 문서 구조 설명

2. **[DATABASE_INTEGRATION_STEPS.md](./DATABASE_INTEGRATION_STEPS.md)**
   - 8단계로 나눈 실전 가이드
   - 각 단계별 상세 설명

3. **[SUPABASE_CLOUDINARY_SETUP.md](./SUPABASE_CLOUDINARY_SETUP.md)**
   - Supabase 프로젝트 생성 방법
   - Cloudinary 계정 설정 방법
   - 데이터베이스 스키마 설계

4. **[BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md)**
   - Backend API 구현 방법
   - 코드 예시 포함

## ⚡ 지금 바로 시작하기

### 1. Supabase 프로젝트 생성 (5분)

1. https://supabase.com 접속 → Sign Up
2. New Project 클릭
3. 프로젝트 이름, 비밀번호 입력
4. API 키 복사해서 메모장에 저장

### 2. Cloudinary 계정 생성 (3분)

1. https://cloudinary.com 접속 → Sign Up
2. Dashboard에서 API 정보 복사

### 3. 환경변수 설정 (2분)

```bash
cd backend
cp .env.example .env  # 파일이 없다면 생성
```

`.env` 파일에 실제 값 입력:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### 4. 의존성 설치 (1분)

```bash
cd backend
npm install @supabase/supabase-js cloudinary multer
npm install -D @types/multer
```

### 5. 데이터베이스 스키마 생성 (5분)

1. Supabase Dashboard → SQL Editor
2. `backend/migrations/001_initial_schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 → Run
4. Table Editor에서 테이블 생성 확인

## 📊 데이터 구조

### 프로젝트 등록 데이터 구조

```
프로젝트:
├── 기본 정보
│   ├── 이름 (name)
│   ├── 설명 (description)
│   ├── 플랫폼 (platform: 'web' | 'app')
│   └── 카테고리 (12개 중 선택)
└── 설정
    ├── 피드백 타입 (다중 선택)
    │   └── User Flow, Interaction Design, Visual Design, 
    │       UX Writing, Information Architecture, Usability
    ├── 상태 (status: 'resolved' | 'unresolved')
    └── 디자인들
        ├── 디자인 이름
        ├── 이미지들 (Cloudinary)
        └── 피드백 질문들
            ├── 커스텀 질문 (직접 입력)
            └── 템플릿 질문 (선택)
```

### 피드백 등록 데이터 구조

```
피드백:
├── 프로젝트 정보
│   ├── 프로젝트 ID
│   └── 디자인 ID
└── 평가 내용
    ├── 별점 평가 (feedback_ratings)
    │   └── 피드백 타입별 1-5점
    └── 텍스트 피드백 (feedbacks)
        ├── 질문 ID
        ├── 화면 번호
        └── 피드백 텍스트
```

## 🔗 연결 구조

```
Frontend (React)
    ↓ API 호출
Backend (Express)
    ├── Supabase (데이터베이스)
    │   └── PostgreSQL (테이블들)
    └── Cloudinary (이미지 저장)
        └── 이미지 URL 반환
```

## ✅ 체크리스트

각 단계를 완료하면 체크하세요:

- [ ] Supabase 프로젝트 생성
- [ ] Cloudinary 계정 생성
- [ ] 환경변수 파일 생성 (`.env`)
- [ ] Backend 의존성 설치
- [ ] 데이터베이스 스키마 생성
- [ ] Backend 설정 파일 생성
- [ ] API 구조 구현
- [ ] Frontend API 연동

## 📝 다음 단계

설정이 완료되면:

1. `docs/DATABASE_INTEGRATION_STEPS.md`를 따라 진행
2. 각 문서의 예시 코드 참고
3. 문제 발생 시 문서의 "문제 해결" 섹션 확인

---

**시작하기**: [DATABASE_SETUP_README.md](./DATABASE_SETUP_README.md) 문서를 열어보세요!

