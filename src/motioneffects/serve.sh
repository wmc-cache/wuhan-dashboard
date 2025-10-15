#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Serving http://localhost:5500 ... (Ctrl+C 退出)"
python3 -m http.server 5500
