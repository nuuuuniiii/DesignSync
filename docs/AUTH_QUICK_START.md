# 인증 구현 빠른 시작 가이드

## 🎯 목표

**임시 user_id 대신 실제 로그인한 사용자의 ID를 사용**하도록 변경합니다.

---

## 📊 전체 프로세스 요약

```
1. Supabase Auth 설정 (당신이 할 일)
   └─ Dashboard에서 설정
   └─ Anon Key 복사

2. 백엔드 인증 API 구현 (제가 할 일)
   └─ 회원가입 API
   └─ 로그인 API
   └─ 토큰 검증 미들웨어

3. 프론트엔드 연동 (제가 할 일)
   └─ API 클라이언트
   └─ 로그인 상태 관리

4. 프로젝트 생성 로직 수정 (제가 할 일)
   └─ 실제 user_id 사용
```

---

## 🚀 지금 당신이 해야 할 일 (단계 1)

### 1️⃣ Supabase Dashboard 접속

1. 브라우저에서 https://supabase.com/dashboard 접속
2. 로그인 후 프로젝트 선택

### 2️⃣ Authentication 설정

1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Providers** 탭 클릭
3. **Email** 항목 찾기
4. **Enable** 버튼 클릭 (이미 활성화되어 있다면 건너뛰기)

### 3️⃣ URL Configuration 설정

1. Authentication 메뉴에서 **URL Configuration** 클릭
2. **Site URL** 입력란에 입력: `http://localhost:3000`
3. **Redirect URLs** 섹션에서 **Add URL** 클릭
4. 입력: `http://localhost:3000/**`
5. **Save** 버튼 클릭

### 4️⃣ Anon Key 복사

1. 왼쪽 메뉴에서 **Settings** 클릭
2. **API** 메뉴 클릭
3. **Project API keys** 섹션 찾기
4. **anon/public** 키 옆의 **복사** 버튼 클릭
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (아주 긴 문자열)

### 5️⃣ 환경변수 파일에 추가

**backend/.env** 파일을 열고 다음 줄을 추가하세요:

```env
SUPABASE_ANON_KEY=복사한-키-여기에-붙여넣기
```

> **주의**: `=` 앞뒤로 공백이 없어야 합니다!

**예시:**
```env
SUPABASE_ANON_KEY=your-actual-anon-key-from-dashboard
```

---

## ✅ 단계 1 완료 체크리스트

- [ ] Supabase Dashboard 접속 완료
- [ ] Email Provider 활성화 완료
- [ ] Site URL 설정: `http://localhost:3000`
- [ ] Redirect URL 추가: `http://localhost:3000/**`
- [ ] Anon Key 복사 완료
- [ ] `backend/.env` 파일에 `SUPABASE_ANON_KEY` 추가 완료

---

## 🎉 단계 1 완료 후

**"단계 1 완료했습니다"** 라고 말씀해주시면, 제가 나머지 단계들을 자동으로 구현하겠습니다!

---

## 📝 참고사항

### 현재 사용 중인 환경변수
- `SUPABASE_URL` - 이미 설정됨 ✅
- `SUPABASE_SERVICE_ROLE_KEY` - 이미 설정됨 ✅
- `SUPABASE_ANON_KEY` - **지금 추가해야 함** ⚠️

### Anon Key vs Service Role Key
- **Anon Key**: 클라이언트용, 공개되어도 안전함
- **Service Role Key**: 서버용, 절대 공개 금지!

---

## ❓ 문제 발생 시

### Q: Anon Key를 찾을 수 없어요
→ Settings → API 메뉴에서 **anon/public** 키를 찾으세요. `eyJ`로 시작하는 긴 문자열입니다.

### Q: 환경변수 파일 위치가 어디인가요?
→ `backend/.env` 파일입니다. `backend` 폴더 안에 있습니다.

### Q: 이미 설정되어 있는 환경변수는 건드리면 안 되나요?
→ 아니요! 기존 환경변수는 그대로 두고, **새로운 줄만 추가**하면 됩니다.

