# 빠른 문제 해결

## 오류: `concurrently: command not found`

이 오류는 **루트 디렉토리에 `concurrently` 패키지가 설치되지 않아서** 발생합니다.

## 해결 방법

루트 디렉토리에서 다음 명령어를 실행하세요:

```bash
cd /Users/aekyo/DesignSync
npm install
```

이 명령어는 `concurrently` 패키지를 설치합니다. (프론트엔드와 백엔드를 동시에 실행하기 위해 필요)

## 전체 실행 순서

```bash
# 1. 루트 패키지 설치 (concurrently)
cd /Users/aekyo/DesignSync
npm install

# 2. 프론트엔드 & 백엔드 의존성 설치
./install.sh

# 3. 개발 서버 실행
npm run dev
```

또는 `dev.sh` 스크립트를 사용하면 자동으로 설치합니다:

```bash
cd /Users/aekyo/DesignSync
./dev.sh
```

## 설명

- `concurrently`는 두 개의 npm 스크립트를 동시에 실행하는 패키지입니다
- 프론트엔드(`npm run dev`)와 백엔드(`npm run dev`)를 한 번에 실행하기 위해 필요합니다
- 루트 디렉토리의 `package.json`에 정의되어 있지만, `npm install`을 실행해야 실제로 설치됩니다

