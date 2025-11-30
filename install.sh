#!/bin/bash

# 프로젝트 루트 디렉토리로 이동
cd /Users/aekyo/DesignSync

echo "🚀 DesignSync 설치를 시작합니다..."
echo "📁 작업 디렉토리: $(pwd)"
echo ""

# Node.js 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다."
    echo "📝 Node.js 설치 방법:"
    echo "   1. Homebrew 사용: brew install node"
    echo "   2. 공식 사이트: https://nodejs.org/"
    echo "   3. nvm 사용: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 버전: $NODE_VERSION"

# npm 확인
if ! command -v npm &> /dev/null; then
    echo "❌ npm이 설치되어 있지 않습니다."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm 버전: $NPM_VERSION"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 1단계: 루트 패키지 설치 (concurrently)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /Users/aekyo/DesignSync
if [ ! -d "node_modules" ] || [ ! -d "node_modules/concurrently" ]; then
    echo "concurrently 패키지를 설치합니다..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 루트 패키지 설치 실패"
        exit 1
    fi
    echo "✅ 루트 패키지 설치 완료"
else
    echo "✅ 루트 패키지가 이미 설치되어 있습니다."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 2단계: 프론트엔드 의존성 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /Users/aekyo/DesignSync/frontend
if [ ! -d "node_modules" ]; then
    echo "프론트엔드 패키지를 설치합니다... (vite, react 등)"
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 프론트엔드 설치 실패"
        exit 1
    fi
    echo "✅ 프론트엔드 설치 완료"
else
    echo "✅ 프론트엔드 의존성이 이미 설치되어 있습니다."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 3단계: 백엔드 의존성 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd /Users/aekyo/DesignSync/backend
if [ ! -d "node_modules" ]; then
    echo "백엔드 패키지를 설치합니다... (express, tsx 등)"
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 백엔드 설치 실패"
        exit 1
    fi
    echo "✅ 백엔드 설치 완료"
else
    echo "✅ 백엔드 의존성이 이미 설치되어 있습니다."
fi

# 루트로 돌아가기
cd /Users/aekyo/DesignSync

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 모든 설치가 완료되었습니다!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 설치된 패키지:"
echo "   ✓ 루트: concurrently (동시 실행용)"
echo "   ✓ 프론트엔드: vite, react, typescript 등"
echo "   ✓ 백엔드: express, tsx, typescript 등"
echo ""
echo "▶️  실행 방법:"
echo "   cd /Users/aekyo/DesignSync"
echo "   npm run dev"
echo ""
echo "   또는:"
echo "   ./dev.sh"
echo ""

