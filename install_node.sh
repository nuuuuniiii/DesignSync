#!/bin/bash

echo "🔍 Node.js 설치 확인 중..."

if command -v node &> /dev/null; then
    echo "✅ Node.js가 이미 설치되어 있습니다."
    node --version
    npm --version
    exit 0
fi

echo "📦 Node.js를 설치합니다..."
echo ""

# Homebrew 확인
if command -v brew &> /dev/null; then
    echo "✅ Homebrew 발견됨"
    echo "Node.js 설치를 시작합니다..."
    brew install node
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Node.js 설치 완료!"
        echo ""
        echo "다음을 실행하여 확인하세요:"
        echo "  node --version"
        echo "  npm --version"
        echo ""
        echo "터미널을 재시작하거나 다음 명령어를 실행하세요:"
        echo "  source ~/.zshrc"
    else
        echo "❌ 설치 중 오류가 발생했습니다."
        exit 1
    fi
else
    echo "❌ Homebrew가 설치되어 있지 않습니다."
    echo ""
    echo "다음 중 하나를 선택하세요:"
    echo "1. Homebrew 설치: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "2. 공식 사이트에서 다운로드: https://nodejs.org/"
    echo "3. nvm 사용: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi
