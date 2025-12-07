# 프론트엔드 로그인/회원가입 디버깅 가이드

## "Supabase Auth is not configured" 에러 해결

프론트엔드 코드를 확인한 결과, **Supabase를 직접 사용하지 않습니다**. 
인증은 백엔드 API (`/api/auth/signup`, `/api/auth/signin`)를 통해 처리됩니다.

## 디버깅 단계

### 1. 브라우저 개발자 도구 확인

1. 프론트엔드 사이트 접속
2. F12 (개발자 도구) 열기
3. **Console** 탭 확인:
   - "Supabase Auth is not configured" 메시지가 어느 파일에서 나오는지 확인
   - 다른 에러 메시지가 있는지 확인
4. **Network** 탭 확인:
   - 로그인/회원가입 시도 시 API 요청이 가는지 확인
   - 요청 URL이 올바른지 확인: `https://design-sync-iota.vercel.app/api/auth/signup` 또는 `/api/auth/signin`
   - 응답 상태 코드 확인 (200, 400, 500 등)
   - 응답 내용 확인

### 2. 환경변수 확인

프론트엔드 Vercel 프로젝트에서:
1. Vercel 대시보드 → **프론트엔드 프로젝트** (design-sync-vp26)
2. **Settings** → **Environment Variables**
3. `VITE_API_BASE_URL` 환경변수 확인:
   - 값: `https://design-sync-iota.vercel.app/api`
   - 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인
4. 환경변수 수정 후 **재배포** 필요

### 3. API 엔드포인트 테스트

브라우저에서 직접 테스트:
```
https://design-sync-iota.vercel.app/api/auth/signup
```
또는 터미널에서:
```bash
curl -X POST https://design-sync-iota.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

### 4. 가능한 원인들

1. **환경변수 미설정**: `VITE_API_BASE_URL`이 설정되지 않았을 수 있음
2. **API 호출 실패**: 백엔드 API가 응답하지 않을 수 있음
3. **CORS 문제**: 백엔드 CORS 설정 문제
4. **브라우저 확장 프로그램**: Supabase 관련 확장 프로그램에서 나오는 메시지일 수 있음

### 5. 빠른 확인 방법

브라우저 콘솔에서 실행:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
```

예상 결과: `https://design-sync-iota.vercel.app/api`

## 해결 방법

1. **환경변수 확인 및 재배포** (가장 중요!)
2. **브라우저 캐시 클리어**: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
3. **시크릿 모드에서 테스트**: 확장 프로그램의 영향을 받지 않도록
4. **정확한 에러 메시지 확인**: 브라우저 콘솔에서 전체 에러 메시지 복사

