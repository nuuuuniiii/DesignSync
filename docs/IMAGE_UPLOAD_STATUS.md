# 이미지 업로드 기능 구현 현황

## ✅ 완료된 작업

### 백엔드
1. **이미지 업로드 미들웨어 (multer)**
   - `backend/src/middleware/upload.middleware.ts`
   - 메모리 스토리지 사용 (Cloudinary 업로드 후 자동 삭제)
   - 이미지 파일만 허용, 최대 10MB, 최대 20개 파일

2. **디자인 생성 서비스**
   - `backend/src/services/designs.service.ts`
   - 디자인 생성 및 Cloudinary 이미지 업로드
   - 데이터베이스에 이미지 URL 저장

3. **디자인 생성 API**
   - `POST /api/projects/:projectId/designs`
   - FormData로 이미지 파일 받기
   - 인증 필요

4. **프로젝트 목록 썸네일**
   - 프로젝트 목록 조회 시 첫 번째 이미지를 썸네일로 반환
   - `thumbnail_url` 필드에 포함

### 프론트엔드
1. **디자인 생성 API 함수**
   - `frontend/src/api/designs.ts`
   - `createDesignWithImages()` 함수

2. **프로젝트 타입 확장**
   - `Project` 인터페이스에 `thumbnail_url` 필드 추가

3. **MyPage 썸네일 표시**
   - 썸네일 이미지가 있으면 표시하도록 준비됨

## 🔄 작업 중

### 프론트엔드: RegistrationPage 이미지 업로드
- 현재: 이미지를 base64로만 저장 (로컬 미리보기용)
- 필요: File 객체로 저장하고 프로젝트 생성 후 업로드

## 📝 구현 방법

### RegistrationPage 수정 필요 사항

1. **이미지 파일 저장**
   - 현재: `uploadedImages: string[]` (base64)
   - 변경: `uploadedImageFiles: File[]` 추가 또는 대체

2. **프로젝트 생성 후 이미지 업로드**
   ```typescript
   // 프로젝트 생성 후
   for (const designName of designs) {
     const designData = designsData[designName]
     if (designData.uploadedImageFiles && designData.uploadedImageFiles.length > 0) {
       await createDesignWithImages(
         projectId,
         designName,
         designData.uploadedImageFiles
       )
     }
   }
   ```

## 🚀 다음 단계

1. RegistrationPage에서 이미지 파일을 File 객체로 저장
2. 프로젝트 생성 후 각 디자인별로 이미지 업로드 API 호출
3. 테스트 및 검증

## 💡 참고 사항

- 백엔드 API는 이미 준비되어 있습니다
- `POST /api/projects/:projectId/designs` 에 FormData로 이미지 파일 전송
- 프로젝트 목록 조회 시 `thumbnail_url` 필드에 썸네일 이미지 URL 포함
- MyPage에서 `thumbnail_url`이 있으면 이미지 표시

