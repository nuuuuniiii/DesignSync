# 빠른 시작 가이드

## ⚠️ 중요: 프로젝트 구조

```
DesignSync/
├── package.json          ← concurrently만 있음
├── frontend/package.json ← vite, react 등
└── backend/package.json  ← express, tsx 등
```

**루트의 `npm install`은 frontend/backend 내부 패키지를 설치하지 않습니다!**
각 폴더에서 따로 `npm install`을 해야 합니다.

## 🚀 빠른 설치 (한 번에)

```bash
cd /Users/aekyo/DesignSync
./install.sh
```

이 스크립트가 자동으로 3단계 모두 설치합니다:
1. 루트 패키지 (concurrently)
2. 프론트엔드 패키지 (vite, react 등)
3. 백엔드 패키지 (express, tsx 등)

## 📝 수동 설치 (3단계)

```bash
cd /Users/aekyo/DesignSync

# 1단계: 루트 패키지 (concurrently)
npm install

# 2단계: 프론트엔드 패키지
cd frontend && npm install && cd ..

# 3단계: 백엔드 패키지
cd backend && npm install && cd ..
```

## ▶️ 실행

```bash
cd /Users/aekyo/DesignSync
npm run dev
```

또는:
```bash
./dev.sh
```

## 확인

- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:8000/health

## 문제 해결

### 오류: `npm: command not found`
→ Node.js 설치: `brew install node`

### 오류: `concurrently: command not found`
→ 루트에서 `npm install` 실행

### 오류: `vite: command not found`
→ `frontend/` 폴더에서 `npm install` 실행

### 오류: `tsx: command not found`
→ `backend/` 폴더에서 `npm install` 실행
