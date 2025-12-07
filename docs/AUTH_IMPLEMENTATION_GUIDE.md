# 인증 구현 가이드

## 📋 현재 상황

- ✅ SignUpPage, SignInPage UI 완성
- ✅ Supabase 데이터베이스 연결 완료
- ❌ 실제 인증 API 미구현
- ❌ 세션/토큰 관리 미구현
- ❌ 프로젝트 생성 시 임시 user_id 사용 중

## 🎯 목표

1. Supabase Auth를 사용한 회원가입/로그인 구현
2. JWT 토큰 기반 인증
3. 로그인한 사용자의 실제 user_id로 프로젝트 생성

## 📝 구현 단계

### 단계 1: Supabase Auth 설정 확인 및 환경변수 추가

**Supabase Dashboard에서:**
1. Authentication → Providers에서 "Email" 활성화
2. Authentication → URL Configuration에서 Site URL 설정: `http://localhost:3000`

**backend/.env에 추가:**
```
SUPABASE_ANON_KEY=your-anon-key-here
```

### 단계 2: 백엔드 - 인증 API 구현

#### 2-1. 회원가입 API (`POST /api/auth/signup`)
- 이메일/비밀번호로 사용자 생성
- Supabase Auth 사용
- users 테이블에 사용자 정보 저장

#### 2-2. 로그인 API (`POST /api/auth/signin`)
- 이메일/비밀번호 검증
- JWT 토큰 반환

#### 2-3. 인증 미들웨어
- 요청 헤더의 토큰 검증
- 인증된 사용자 정보를 `req.user`에 추가

### 단계 3: 프론트엔드 - API 클라이언트 구현

#### 3-1. 인증 API 클라이언트 (`frontend/src/api/auth.ts`)
- 회원가입/로그인 API 호출 함수
- 토큰 로컬스토리지 저장/조회

#### 3-2. 인증 컨텍스트 (`frontend/src/contexts/AuthContext.tsx`)
- 전역 로그인 상태 관리
- 로그인/로그아웃 함수

### 단계 4: 프로젝트 생성 시 실제 user_id 사용

#### 4-1. 프로젝트 생성 컨트롤러 수정
- 임시 user_id 대신 인증 미들웨어에서 추출한 실제 user_id 사용

### 단계 5: 보호된 라우트 설정

- 로그인 필요 페이지 보호
- 미로그인 시 로그인 페이지로 리다이렉트

## 🔄 작업 순서

1. **Supabase Auth 설정 확인** (수동)
2. **백엔드 인증 API 구현** (우리가 할 일)
3. **프론트엔드 API 연동** (우리가 할 일)
4. **세션 관리 구현** (우리가 할 일)
5. **프로젝트 생성 로직 수정** (우리가 할 일)

## 📌 각 단계별 상세 설명

각 단계를 순서대로 진행하면서 필요한 파일들을 생성하고 코드를 작성합니다.

---

## 다음 단계

이제 각 단계를 하나씩 구현하겠습니다. 먼저 **단계 1: Supabase Auth 설정 확인**부터 시작합니다.

