#!/bin/bash

set -e

if [ -z "$ACCESS_TOKEN" ]; then
  clasp list &>/dev/null
  ACCESS_TOKEN=$(cat ~/.clasprc.json | jq -r .tokens.default.access_token)
fi

curl -H "Authorization: Bearer $ACCESS_TOKEN" -L "$@"
