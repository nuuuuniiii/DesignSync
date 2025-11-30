# DesignSync Frontend

DesignSync의 프론트엔드 애플리케이션입니다.

## 기술 스택

- React 18
- TypeScript
- Vite
- React Router
- Axios

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

환경변수 파일을 생성하세요. (현재는 선택사항)

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 5. 프로덕션 미리보기

```bash
npm run preview
```

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier 포맷팅
- `npm run type-check` - TypeScript 타입 체크
- `npm test` - 테스트 실행

## 프로젝트 구조

```
frontend/
├── src/
│   ├── api/           # API 호출 함수
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── hooks/         # Custom hooks
│   ├── types/         # TypeScript 타입 정의
│   ├── utils/         # 유틸리티 함수
│   ├── App.tsx        # 메인 앱 컴포넌트
│   ├── main.tsx       # 진입점
│   └── index.css      # 글로벌 스타일
├── public/            # 정적 파일
└── package.json
```

## 개발 가이드

자세한 개발 가이드는 루트 디렉토리의 `docs/Checkllist.md`를 참고하세요.

