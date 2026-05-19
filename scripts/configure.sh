#!/bin/bash

set -e

SCRIPT_DIR=$(cd $(dirname $0); pwd)

export APP_URL=$($SCRIPT_DIR/appurl.sh)

echo "Setting script properties..."
$SCRIPT_DIR/admin.sh setScriptProperties '{"calendarId": "'$CALENDAR_ID'", "ownerEmail": "'$OWNER_EMAIL'"}'

echo "Do initial sync..."
$SCRIPT_DIR/admin.sh tryInitialSync '{}'

echo "Trying to create triggers..."
$SCRIPT_DIR/admin.sh tryCreateTriggers '{}'

echo "Configuration completed successfully!"