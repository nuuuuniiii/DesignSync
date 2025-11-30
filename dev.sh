#!/bin/bash

# 프로젝트 루트 디렉토리로 이동
cd /Users/aekyo/DesignSync

echo "🚀 DesignSync 개발 서버를 시작합니다..."
echo "📁 작업 디렉토리: $(pwd)"
echo ""

# concurrently가 설치되어 있는지 확인
if [ ! -d "node_modules" ] || [ ! -d "node_modules/concurrently" ]; then
    echo "📦 concurrently 패키지를 설치합니다..."
    echo "   (프론트엔드와 백엔드를 동시에 실행하기 위해 필요합니다)"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 패키지 설치 실패"
        exit 1
    fi
    echo ""
    echo "✅ 설치 완료!"
    echo ""
fi

echo "✅ 프론트엔드와 백엔드를 동시에 실행합니다..."
echo "   프론트엔드: http://localhost:3000"
echo "   백엔드: http://localhost:8000"
echo ""
echo "종료하려면 Ctrl+C를 누르세요"
echo ""

npm run dev

