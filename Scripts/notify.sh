#!/bin/bash

# =================================================================
# 🛡️ SOVEREIGN SYSTEM NOTIFIER & LOGGER
# =================================================================
# This script logs events locally and pushes high-priority alerts
# to Slack for mobile monitoring.
# =================================================================

# 📂 Configuration
LOG_FILE_NAME="system_alerts.log"
# 🔴 REPLACE THIS with your Slack Incoming Webhook URL
SLACK_WEBHOOK_URL="REPLACE_WITH_YOUR_WEBHOOK_URL" 

# 🛠️ Setup Paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
LOG_DIR="$SCRIPT_DIR/../logs"
LOG_PATH="$LOG_DIR/$LOG_FILE_NAME"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

notify() {
    local STATUS=$1
    local MESSAGE=$2
    local TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    local COLOR="#CCCCCC"
    local EMOJI="ℹ️"

    # 🎨 Set Aesthetics based on Severity
    case $STATUS in
        "SUCCESS")
            COLOR="#36a64f"
            EMOJI="✅"
            ;;
        "FAILURE"|"ERROR")
            COLOR="#FF0000"
            EMOJI="🚨"
            ;;
        "WARNING")
            COLOR="#FFCC00"
            EMOJI="⚠️"
            ;;
    esac

    # 1. 📝 LOG LOCALLY (Always)
    echo "[$TIMESTAMP] [$STATUS] $MESSAGE" >> "$LOG_PATH"
    echo "✔ Logged to $LOG_FILE_NAME"

    # 2. ⚡ SEND TO SLACK (If configured)
    if [[ "$SLACK_WEBHOOK_URL" != "REPLACE_WITH_YOUR_WEBHOOK_URL" ]]; then
        echo "🚀 Sending Slack alert..."
        curl -s -X POST -H 'Content-type: application/json' --data "{
            \"attachments\": [
                {
                    \"fallback\": \"$STATUS: $MESSAGE\",
                    \"color\": \"$COLOR\",
                    \"pretext\": \"$EMOJI *Elite Estate System Alert*\",
                    \"fields\": [
                        {
                            \"title\": \"Status\",
                            \"value\": \"$STATUS\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Timestamp\",
                            \"value\": \"$TIMESTAMP\",
                            \"short\": true
                        },
                        {
                            \"title\": \"Message\",
                            \"value\": \"$MESSAGE\",
                            \"short\": false
                        }
                    ],
                    \"footer\": \"Sovereign Infrastructure Monitor\"
                }
            ]
        }" $SLACK_WEBHOOK_URL > /dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Slack notification sent successfully."
        else
            echo "❌ Failed to send Slack notification."
        fi
    else
        echo "⚠️ Slack notification skipped: SLACK_WEBHOOK_URL is not configured."
    fi
}

# 🚀 Entry Point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [ "$#" -lt 2 ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Usage: ./notify.sh <STATUS> <MESSAGE>"
        echo "Example: ./notify.sh ERROR 'Database connection timed out'"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 1
    fi
    notify "$1" "$2"
fi
