#!/bin/bash

# 提示詞筆記本管理器 - 啟動腳本

echo "🚀 啟動提示詞筆記本管理器..."
echo "📡 伺服器位址: http://localhost:8000"
echo "💡 按 Ctrl+C 可停止伺服器"
echo ""

# 啟動 Python HTTP 伺服器
python3 -m http.server 8000
