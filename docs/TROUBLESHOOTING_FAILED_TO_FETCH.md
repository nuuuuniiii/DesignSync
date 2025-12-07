# "Failed to fetch" 에러 해결 가이드

## 가능한 원인들

### 1. CORS 설정 문제 ⚠️ 가장 흔한 원인

**확인 사항:**
- 백엔드 Vercel 프로젝트의 환경변수에서 `CORS_ORIGIN`이 올바르게 설정되어 있는지 확인
- 프론트엔드 URL이 포함되어 있어야 합니다

**해결 방법:**
1. Vercel 대시보드 → 백엔드 프로젝트 → Settings → Environment Variables
2. `CORS_ORIGIN` 환경변수 확인:
   - 예: `https://your-frontend.vercel.app`
   - 여러 개 허용하려면: `https://frontend1.vercel.app,https://frontend2.vercel.app`
3. 환경변수 수정 후 **재배포** 필요

### 2. 백엔드 URL 설정 문제

**확인 사항:**
- 프론트엔드의 `VITE_API_BASE_URL` 환경변수가 올바른지 확인
- 백엔드 URL에 `/api`가 포함되어 있어야 합니다

**해결 방법:**
1. Vercel 대시보드 → 프론트엔드 프로젝트 → Settings → Environment Variables
2. `VITE_API_BASE_URL` 확인:
   - 올바른 예: `https://your-backend.vercel.app/api`
   - 잘못된 예: `https://your-backend.vercel.app` (마지막에 `/api` 없음)
3. 환경변수 수정 후 **재배포** 필요

### 3. 백엔드가 정상 작동하는지 확인

**확인 방법:**
브라우저나 터미널에서:
```bash
curl https://your-backend.vercel.app/health
# 또는
curl https://your-backend.vercel.app/api/test
```

**예상 응답:**
```json
{"status":"ok","message":"DesignSync API Server"}
```

**만약 응답이 없다면:**
- 백엔드 배포가 실패했을 수 있음
- Vercel 대시보드에서 배포 로그 확인
- 빌드 에러가 있는지 확인

### 4. 브라우저 개발자 도구 확인

**확인 방법:**
1. 프론트엔드 사이트 접속
2. F12 (개발자 도구) 열기
3. **Console** 탭에서 정확한 에러 메시지 확인
4. **Network** 탭에서:
   - 실패한 API 요청 확인
   - 요청 URL 확인
   - 응답 상태 코드 확인 (404, 500, CORS 에러 등)

### 5. Vercel Serverless Function 설정 확인

**확인 사항:**
- `backend/api/index.ts` 파일이 존재하는지
- `backend/vercel.json` 파일이 올바른지
- `@vercel/node` 패키지가 설치되어 있는지

**해결 방법:**
위 파일들이 모두 올바르게 설정되어 있는지 확인하고, 문제가 있으면 다시 배포

## 빠른 체크리스트

- [ ] 백엔드 Vercel 프로젝트의 `CORS_ORIGIN` 환경변수에 프론트엔드 URL이 포함되어 있나요?
- [ ] 프론트엔드 Vercel 프로젝트의 `VITE_API_BASE_URL` 환경변수가 올바른가요? (끝에 `/api` 포함)
- [ ] 백엔드 `/health` 엔드포인트가 정상 작동하나요?
- [ ] 백엔드와 프론트엔드가 모두 성공적으로 배포되었나요?
- [ ] 환경변수 변경 후 재배포를 했나요?

## 디버깅 단계

1. **백엔드 헬스 체크:**
   ```bash
   curl https://your-backend.vercel.app/health
   ```

2. **브라우저 콘솔 확인:**
   - F12 → Console 탭
   - 정확한 에러 메시지 확인

3. **네트워크 탭 확인:**
   - F12 → Network 탭
   - 실패한 요청 클릭
   - Request URL, Status Code, Response 확인

4. **Vercel 로그 확인:**
   - Vercel 대시보드 → 프로젝트 → Deployments
   - 최신 배포 클릭 → Functions 탭
   - 에러 로그 확인

