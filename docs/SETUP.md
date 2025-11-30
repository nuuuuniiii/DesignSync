# DesignSync 로컬 실행 가이드

## 사전 요구사항

### Node.js 설치

**macOS 사용자:**

1. **Homebrew를 사용한 설치 (권장)**
   ```bash
   # Homebrew 설치 확인
   brew --version
   
   # Node.js 설치
   brew install node
   ```

2. **공식 웹사이트에서 다운로드**
   - https://nodejs.org/ 에서 LTS 버전 다운로드 및 설치

3. **nvm (Node Version Manager) 사용 (권장)**
   ```bash
   # nvm 설치
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # 터미널 재시작 후
   nvm install 18
   nvm use 18
   ```

**설치 확인:**
```bash
node --version  # v18 이상
npm --version   # 9 이상
```

## 설치 및 실행

### 1. 프론트엔드 설치 및 실행

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 2. 백엔드 설치 및 실행 (별도 터미널)

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

## 빠른 시작 (한 번에 실행)

루트 디렉토리에서:

```bash
# 프론트엔드와 백엔드 동시 설치
cd frontend && npm install && cd ../backend && npm install && cd ..

# 두 개의 터미널을 열어서 각각 실행
# 터미널 1:
cd frontend && npm run dev

# 터미널 2:
cd backend && npm run dev
```

## 문제 해결

### npm install 시 오류가 발생하는 경우

1. **캐시 정리**
   ```bash
   npm cache clean --force
   ```

2. **node_modules 삭제 후 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **권한 문제**
   ```bash
   sudo npm install
   ```

### 포트가 이미 사용 중인 경우

프론트엔드 포트 변경 (3000 → 3001):
- `frontend/vite.config.ts`에서 `server.port` 수정

백엔드 포트 변경 (8000 → 8001):
- `backend/.env` 파일 생성 및 `PORT=8001` 설정

### Node.js 버전이 맞지 않는 경우

Node.js 18 이상이 필요합니다:
```bash
node --version  # 확인
nvm install 18  # nvm 사용 시
nvm use 18
```

## 확인 사항

실행 후 브라우저에서:
- 프론트엔드: http://localhost:3000
- 백엔드 Health Check: http://localhost:8000/health

백엔드가 정상 실행되면 `{"status":"ok","message":"DesignSync API Server"}` 응답을 받을 수 있습니다.

