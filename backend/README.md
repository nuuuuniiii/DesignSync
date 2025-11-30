# DesignSync Backend

DesignSync의 백엔드 API 서버입니다.

## 기술 스택

- Node.js
- Express
- TypeScript
- Winston (로깅)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

```bash
cp .env.example .env
```

### 3. 개발 서버 실행

```bash
npm run dev
```

서버는 `http://localhost:8000`에서 실행됩니다.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 5. 프로덕션 실행

```bash
npm start
```

## 스크립트

- `npm run dev` - 개발 모드로 실행 (자동 재시작)
- `npm run build` - TypeScript 컴파일
- `npm start` - 프로덕션 모드로 실행
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier 포맷팅
- `npm run type-check` - TypeScript 타입 체크
- `npm test` - 테스트 실행

## 프로젝트 구조

```
backend/
├── src/
│   ├── config/         # 설정 파일
│   ├── controllers/    # 컨트롤러
│   ├── middleware/     # 미들웨어
│   ├── routes/         # 라우트 정의
│   ├── services/       # 비즈니스 로직
│   ├── types/          # TypeScript 타입 정의
│   ├── utils/          # 유틸리티 함수
│   └── index.ts        # 진입점
├── dist/               # 빌드 결과물
├── logs/               # 로그 파일
└── package.json
```

## API 엔드포인트

(추후 API 엔드포인트 문서 추가 예정)

## 로깅

Winston을 사용하여 로그를 관리합니다. 로그는 `logs/` 디렉토리에 저장됩니다.

- `logs/error.log` - 에러 로그
- `logs/combined.log` - 모든 로그

## 개발 가이드

자세한 개발 가이드는 루트 디렉토리의 `docs/Checkllist.md`를 참고하세요.

