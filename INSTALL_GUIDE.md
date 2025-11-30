# DesignSync 설치 가이드

## 프로젝트 구조

```
DesignSync/
├── package.json          ← concurrently만 있음 (동시 실행용)
├── frontend/
│   └── package.json      ← vite, react, typescript 등
└── backend/
    └── package.json      ← express, tsx, typescript 등
```

## 중요 설명

**루트의 `npm install`은 frontend/backend 폴더 내부 패키지까지 설치하지 않습니다!**

각 폴더에서 따로 `npm install`을 해야 정상 실행됩니다.

## 설치 순서 (3단계)

### 방법 1: 자동 설치 스크립트 (권장)

```bash
cd /Users/aekyo/DesignSync
./install.sh
```

이 스크립트가 자동으로:
1. 루트 패키지 설치 (concurrently)
2. 프론트엔드 패키지 설치
3. 백엔드 패키지 설치

### 방법 2: 수동 설치

```bash
cd /Users/aekyo/DesignSync

# 1. 루트 패키지 설치 (concurrently)
npm install

# 2. 프론트엔드 패키지 설치
cd frontend
npm install
cd ..

# 3. 백엔드 패키지 설치
cd backend
npm install
cd ..
```

### 방법 3: package.json 스크립트 사용

```bash
cd /Users/aekyo/DesignSync

# 루트 패키지 설치
npm install

# 프론트엔드 & 백엔드 동시 설치
npm run install:all
```

## 실행 방법

설치가 완료되면:

```bash
cd /Users/aekyo/DesignSync
npm run dev
```

또는:

```bash
./dev.sh
```

## 각 폴더의 역할

### 루트 (`/Users/aekyo/DesignSync`)
- `package.json`: concurrently만 포함
- 역할: 프론트엔드와 백엔드를 동시에 실행하는 래퍼

### 프론트엔드 (`frontend/`)
- `package.json`: vite, react, typescript 등
- 역할: React 애플리케이션

### 백엔드 (`backend/`)
- `package.json`: express, tsx, typescript 등
- 역할: Express API 서버

## 문제 해결

### 각 폴더별로 node_modules 확인

```bash
# 루트
ls /Users/aekyo/DesignSync/node_modules

# 프론트엔드
ls /Users/aekyo/DesignSync/frontend/node_modules

# 백엔드
ls /Users/aekyo/DesignSync/backend/node_modules
```

### 설치 확인

```bash
# 루트에서 concurrently 확인
cd /Users/aekyo/DesignSync
ls node_modules/concurrently

# 프론트엔드에서 vite 확인
cd /Users/aekyo/DesignSync/frontend
ls node_modules/vite

# 백엔드에서 express 확인
cd /Users/aekyo/DesignSync/backend
ls node_modules/express
```

모든 폴더에 `node_modules`가 있어야 정상입니다!

