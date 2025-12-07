# 인증 구현 단계별 가이드

이 가이드는 인증 구현을 위한 **단계별 체크리스트**입니다. 각 단계에서 **당신이 해야 할 일**과 **제가 구현할 부분**을 명확히 구분했습니다.

---

## 📍 **단계 1: Supabase Auth 설정 확인** (당신이 해야 할 일)

### 1-1. Supabase Dashboard에서 Auth 설정

1. **Supabase 프로젝트 대시보드 접속**
   - https://supabase.com/dashboard 로그인
   - 프로젝트 선택

2. **Authentication 설정 확인**
   - 왼쪽 메뉴에서 **Authentication** 클릭
   - **Providers** 탭에서 **Email** 프로바이더가 활성화되어 있는지 확인
   - 활성화되어 있지 않으면 **Enable** 버튼 클릭

3. **URL Configuration 설정**
   - Authentication → **URL Configuration** 메뉴로 이동
   - **Site URL** 입력: `http://localhost:3000`
   - **Redirect URLs**에 추가: `http://localhost:3000/**`

4. **Anon Key 확인**
   - 왼쪽 메뉴에서 **Settings** → **API** 클릭
   - **Project API keys** 섹션에서 **anon/public** 키 복사
   - 이 키를 다음 단계에서 사용합니다

### 1-2. 환경변수 파일 수정

**backend/.env** 파일을 열고 다음 줄을 추가하세요:

```env
SUPABASE_ANON_KEY=복사한-anon-key-여기에-붙여넣기
```

> **참고**: `SUPABASE_SERVICE_ROLE_KEY`와는 다른 키입니다. `anon/public` 키를 사용합니다.

---

## 📍 **단계 2: 백엔드 인증 API 구현** (제가 구현합니다)

다음 파일들을 생성/수정합니다:
- `backend/src/services/auth.service.ts` - 인증 비즈니스 로직
- `backend/src/controllers/auth.controller.ts` - 인증 컨트롤러
- `backend/src/routes/auth.routes.ts` - 인증 라우트
- `backend/src/middleware/auth.middleware.ts` - JWT 토큰 검증 미들웨어
- `backend/src/config/supabase.ts` - Anon Key 클라이언트 추가

이 단계가 완료되면 다음 API 엔드포인트가 사용 가능합니다:
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/signin` - 로그인
- `GET /api/auth/me` - 현재 로그인한 사용자 정보

---

## 📍 **단계 3: 프론트엔드 인증 구현** (제가 구현합니다)

다음 파일들을 생성/수정합니다:
- `frontend/src/api/auth.ts` - 인증 API 클라이언트
- `frontend/src/contexts/AuthContext.tsx` - 전역 인증 상태 관리
- `frontend/src/pages/SignUpPage.tsx` - API 연동
- `frontend/src/pages/SignInPage.tsx` - API 연동
- `frontend/src/components/Layout/GNB.tsx` - 로그인 상태에 따른 UI 변경

---

## 📍 **단계 4: 프로젝트 생성 로직 수정** (제가 구현합니다)

- `backend/src/controllers/projects.controller.ts` - 임시 user_id 대신 실제 user_id 사용
- 인증 미들웨어를 프로젝트 생성 라우트에 적용

---

## 📍 **단계 5: 보호된 라우트 설정** (제가 구현합니다)

- 로그인이 필요한 페이지에 인증 체크 추가
- 미로그인 시 로그인 페이지로 리다이렉트

---

## 🚀 시작하기

**먼저 단계 1을 완료해주세요!**

단계 1이 완료되면 말씀해주시면, 나머지 단계들을 순서대로 구현하겠습니다.

---

## ❓ FAQ

### Q1. Anon Key와 Service Role Key의 차이는?
- **Anon Key**: 클라이언트에서 사용하는 공개 키. RLS 정책 적용됨.
- **Service Role Key**: 서버에서만 사용하는 비밀 키. RLS 정책 우회 가능.

### Q2. 왜 Anon Key가 필요한가요?
- Supabase Auth를 사용하려면 Anon Key가 필요합니다.
- Service Role Key만으로는 Auth 기능을 사용할 수 없습니다.

### Q3. 보안 문제는 없나요?
- Anon Key는 공개되어도 안전합니다 (Supabase RLS 정책 보호)
- 하지만 Service Role Key는 절대 공개하면 안 됩니다!

---

## 📞 다음 단계

**단계 1 완료 후** "단계 1 완료했습니다"라고 말씀해주시면, 바로 단계 2부터 시작하겠습니다!

