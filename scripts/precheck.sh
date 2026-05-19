#!/bin/bash

CLASPRC_PATH="$HOME/.clasprc.json"

if [ ! -f "$CLASPRC_PATH" ]; then
    echo "Error: $CLASPRC_PATH がありません。clasp login を実行してください。"
fi
echo "✓ $CLASPRC_PATH が存在します"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq がインストールされていません。インストールしてください。"
fi
echo "✓ jq がインストールされています"

if ! command -v grep &> /dev/null; then
    echo "Error: grep がインストールされていません。インストールしてください。"
fi
echo "✓ grep がインストールされています"

if ! command -v awk &> /dev/null; then
    echo "Error: awk がインストールされていません。インストールしてください。"
fi
echo "✓ awk がインストールされています"

echo ""
echo "チェックを再実行する場合は以下を実行してください:"
echo "  scripts/precheck.sh"
