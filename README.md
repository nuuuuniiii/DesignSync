# DesignSync

디자이너가 프로젝트별 시안을 공유하고, 구조화된 피드백을 빠르게 수집·정리할 수 있는 웹 애플리케이션입니다.

## 🚀 빠른 시작 (단 한 줄!)

```bash
cd /Users/aekyo/DesignSync && ./install.sh
```

그 다음 실행:
```bash
npm run dev
```

끝! 이제 프론트엔드와 백엔드가 동시에 실행됩니다.

---

## 상세 설명

### 설치 스크립트 (`./install.sh`)

**직접 `npm install`을 실행할 필요 없습니다!** 

`./install.sh` 스크립트가 자동으로:
1. ✅ 루트 패키지 설치 (concurrently)
2. ✅ 프론트엔드 패키지 설치 (vite, react 등)
3. ✅ 백엔드 패키지 설치 (express, tsx 등)

모두 자동으로 처리합니다.

### 전체 실행 순서

```bash
# 1. 설치 (모든 npm install 자동 실행)
cd /Users/aekyo/DesignSync
./install.sh

# 2. 실행
npm run dev
```

### 또는 수동으로 설치하고 싶다면

```bash
# 루트 패키지
npm install

# 프론트엔드
cd frontend && npm install && cd ..

# 백엔드
cd backend && npm install && cd ..
```

하지만 스크립트를 사용하는 것이 훨씬 편합니다! 🎉

---

## 프로젝트 개요

DesignSync는 카테고리 기반 큐레이션과 정량/정성 피드백을 동시에 관리하여 프로젝트 의사결정을 지원하는 플랫폼입니다.

## 주요 기능 (MVP)

- 프로젝트 등록 및 관리 (카테고리, 시안 업로드, 피드백 요청 질문)
- 피드백 작성 (별점 평가, 텍스트 피드백)
- 프로젝트 탐색 (Web/Apps, 카테고리별, Unsolved/Solved 필터)
- My Page (내 프로젝트 관리, 내가 남긴 피드백 조회)
- Project Overview (별점, Designs별 화면 및 피드백 조회)

## 기술 스택

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: (초기 Mock 데이터, 이후 실제 DB 연동 예정)

## 프로젝트 위치

```
/Users/aekyo/DesignSync
├── package.json          ← concurrently만
├── frontend/             ← vite, react 등
│   └── package.json
└── backend/              ← express, tsx 등
    └── package.json
```

## 상세 설치 가이드

자세한 내용은 [`docs/SETUP.md`](./docs/SETUP.md) 또는 [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md)를 참고하세요.

## 개발 가이드

- [PRD 문서](./docs/PRD.md)
- [체크리스트](./docs/Checkllist.md)
- [디자인 가이드](./docs/DESIGN.md)
- [폰트 가이드](./docs/FONTS.md)

## 라이선스

MIT License - LICENSE 파일 참고
