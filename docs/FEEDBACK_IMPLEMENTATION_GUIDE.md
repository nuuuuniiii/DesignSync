# 피드백 등록 및 조회 기능 구현 가이드

## 현재 상태

### 완료된 작업
1. ✅ 백엔드 피드백 서비스 생성 (`backend/src/services/feedbacks.service.ts`)
2. ✅ 백엔드 피드백 컨트롤러 생성 (`backend/src/controllers/feedbacks.controller.ts`)
3. ✅ 백엔드 피드백 라우트 생성 (`backend/src/routes/feedbacks.routes.ts`)
4. ✅ 프론트엔드 피드백 API 클라이언트 생성 (`frontend/src/api/feedbacks.ts`)

### 남은 작업

1. **프론트엔드 피드백 등록 기능 구현**
   - `NewFeedbackScreenPage`에서 `location.state`에서 `ratings` 받아오기
   - 모든 디자인의 피드백을 수집하여 API 호출
   - 등록 성공 후 프로젝트 상세 페이지로 이동

2. **백엔드 프로젝트 상세 조회 시 피드백 포함**
   - `projects.service.ts`의 `getProjectByIdWithDetails`에 피드백 조회 추가
   - 각 디자인/질문별로 피드백 그룹화

3. **프론트엔드 피드백 표시**
   - `ProjectOverviewPage`에서 피드백 데이터 받아오기
   - `FeedbackItem` 컴포넌트에 실제 피드백 데이터 전달

## 다음 단계

피드백 등록 및 조회 기능을 완전히 구현하려면 다음 작업들이 필요합니다:

1. `NewFeedbackScreenPage.tsx`의 `handleRegister` 함수 구현
2. `projects.service.ts`의 `getProjectByIdWithDetails`에 피드백 조회 추가
3. `ProjectOverviewPage.tsx`에서 피드백 데이터 표시

이 작업들은 복잡하므로 단계별로 진행해야 합니다.

