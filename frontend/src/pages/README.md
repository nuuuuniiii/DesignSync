# Pages

Figma 디자인과 PRD를 기반으로 구현된 페이지 컴포넌트들입니다.

## 페이지 목록

### 1. ExplorePage (`/explore`)
- Web/Apps 선택
- 카테고리 및 상태 필터 (Unsolved/Solved)
- 프로젝트 카드 목록
- Add New Project 버튼

**Figma 링크**: [DesignSync 응용디자인](https://www.figma.com/design/jAVPcCd7XLMMhbUO8oHxhn/DesignSync-%EC%9D%91%EC%9A%A9%EB%94%94%EC%9E%90%EC%9D%B8?node-id=10-2684&m=dev)

### 2. MyPage (`/my-page`)
- My Project 탭: 내가 등록한 프로젝트 목록, Select 모드로 Resolved/Edit/Delete
- My Feedback 탭: 내가 피드백을 남긴 프로젝트 목록

### 3. ProjectRegisterPage (`/projects/new`, `/projects/:id/edit`)
- 프로젝트 이름, 설명 입력
- App/Web 선택
- 카테고리 선택
- 별점 평가 피드백 타입 선택 (체크박스)
- 디자인 이미지 업로드
- 피드백 이름 선택/직접입력

### 4. ProjectOverviewPage (`/projects/:id`)
- 프로젝트 전체 평균 별점
- Designs별 화면 목록 및 피드백 요약
- New Feedback 버튼

### 5. NewFeedbackRatingPage (`/projects/:id/feedback/rating`)
- 별점 슬라이더 (1-5점) - 피드백 타입별로

## 라우팅 구조

```
/ → /explore (리다이렉트)
/explore → ExplorePage
/my-page → MyPage
/projects/new → ProjectRegisterPage
/projects/:id → ProjectOverviewPage
/projects/:id/edit → ProjectRegisterPage
/projects/:id/feedback/rating → NewFeedbackRatingPage
```

## Mock 데이터

현재 모든 페이지는 Mock 데이터를 사용하고 있습니다. 추후 API 연동 시:
- `src/api/` 디렉토리에 API 함수 추가
- 각 페이지에서 API 호출로 Mock 데이터 교체

## TODO

- [ ] API 연동
- [ ] 에러 핸들링
- [ ] 로딩 상태 관리
- [ ] 폼 검증 강화
- [ ] 이미지 업로드 실제 구현
- [ ] 선택 모드 UX 개선

