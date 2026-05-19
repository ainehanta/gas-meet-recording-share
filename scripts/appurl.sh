#!/bin/bash

set -e

SCRIPT_DIR=$(cd $(dirname $0); pwd)

if [ -z "$DEPLOYMENT_ID" ]; then
  DEPLOYMENT_ID=$($SCRIPT_DIR/deploymentid.sh)
fi

if [ -z "$HD" ]; then
  DECODED_ID_TOKEN=$(cat ~/.clasprc.json | jq -r '.tokens.default.id_token | split(".").[1] | @base64d')
  HD=$(echo $DECODED_ID_TOKEN | jq -r .hd)
fi

echo https://script.google.com/a/macros/$HD/s/$DEPLOYMENT_ID/exec