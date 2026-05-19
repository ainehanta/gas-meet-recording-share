#!/bin/bash

set -e

SCRIPT_DIR=$(cd $(dirname $0); pwd)

if [ -z "$APP_URL" ]; then
  APP_URL=$($SCRIPT_DIR/appurl.sh)
fi

ACTION_NAME="$1"
shift
PAYLOAD="$1"
shift

$SCRIPT_DIR/gascurl.sh -H "Content-Type: application/json" -d "$PAYLOAD" -w '\n' "$@" "$APP_URL/api/admin/$ACTION_NAME"