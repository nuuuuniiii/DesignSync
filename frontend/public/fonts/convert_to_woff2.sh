#!/bin/bash

# Revalia 폰트 TTF를 WOFF2로 변환하는 스크립트
# fonttools를 사용하여 변환합니다.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# fonttools 설치 확인 및 설치
if ! command -v python3 &> /dev/null; then
    echo "Python3이 설치되어 있지 않습니다."
    exit 1
fi

if ! python3 -c "import fontTools" 2>/dev/null; then
    echo "fonttools를 설치합니다..."
    pip3 install fonttools[woff]
fi

# TTF 파일이 있는지 확인
if [ ! -f "Revalia-Regular.ttf" ]; then
    echo "Revalia-Regular.ttf 파일을 찾을 수 없습니다."
    exit 1
fi

# WOFF2로 변환
echo "Revalia-Regular.ttf를 WOFF2로 변환 중..."
python3 -m fontTools.ttLib.woff2 compress -o Revalia-Regular.woff2 Revalia-Regular.ttf

if [ $? -eq 0 ]; then
    echo "✅ 변환 완료: Revalia-Regular.woff2"
    ls -lh Revalia-Regular.woff2
else
    echo "❌ 변환 실패"
    exit 1
fi

