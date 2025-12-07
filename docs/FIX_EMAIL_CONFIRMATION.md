# 이메일 확인 오류 해결 방법

## 문제 상황

회원가입 후 로그인 시 "Email not confirmed" 오류가 발생합니다.

## 원인

Supabase Auth는 기본적으로 이메일 확인을 요구합니다. 개발 단계에서는 이메일 확인을 비활성화하는 것이 편리합니다.

## 해결 방법 1: 이메일 확인 비활성화 (개발용 - 추천)

### 단계별 가이드

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **Authentication 설정 열기**
   - 왼쪽 메뉴에서 **Authentication** 클릭
   - **Providers** 탭 클릭

3. **Email Provider 설정**
   - **Email** 항목에서 **Configure** 버튼 클릭
   - 또는 **Email** 항목을 클릭하여 설정 확장

4. **이메일 확인 비활성화**
   - **"Confirm email"** 옵션을 찾습니다
   - **비활성화 (OFF)** 상태로 변경
   - 또는 **"Enable email confirmations"** 체크박스를 해제

5. **저장**
   - 설정을 저장합니다

### 설정 위치

```
Authentication → Providers → Email → Configure
→ "Confirm email" 또는 "Enable email confirmations" 옵션
```

---

## 해결 방법 2: 이메일 확인 활성화 (프로덕션용)

프로덕션 환경에서는 이메일 확인을 활성화하는 것이 보안상 좋습니다.

1. **Supabase Dashboard에서 이메일 확인 활성화**
2. **이메일 템플릿 설정** (선택사항)
   - Authentication → Email Templates
   - 확인 이메일 템플릿 커스터마이징

3. **이메일 확인 코드 재전송 기능 구현** (선택사항)

---

## 테스트 방법

1. 기존 계정 삭제 (선택사항)
   - Supabase Dashboard → Authentication → Users
   - 테스트 계정 삭제

2. 회원가입 재시도
   - http://localhost:3000/sign-up 에서 새 계정 생성

3. 로그인 시도
   - http://localhost:3000/sign-in 에서 로그인
   - 이제 "Email not confirmed" 오류 없이 로그인되어야 합니다

---

## 참고

- 개발 단계: 이메일 확인 비활성화 (간편함)
- 프로덕션: 이메일 확인 활성화 (보안)

