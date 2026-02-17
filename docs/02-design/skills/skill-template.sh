#!/bin/bash
# Skill Template: <Command Name>
# Description: <Brief description>

# Get directory containing this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Path to node and CLI entry point
NODE_CMD="$(command -v node)"
CLI_PATH="$SCRIPT_DIR/../../src/cli.js"

# Check if node is available
if [ -z "$NODE_CMD" ]; then
    echo "Error: node not found in PATH" >&2
    echo "Please install Node.js 18+ and ensure it's in your PATH" >&2
    exit 1
fi

# Check if CLI exists
if [ ! -f "$CLI_PATH" ]; then
    echo "Error: CLI not found at $CLI_PATH" >&2
    exit 1
fi

# Map skill command to CLI command
CLI_CMD="agent-speech"
SKILL_CMD="${0##*/skill-}"

# Build CLI arguments
CLI_ARGS=()

case "$SKILL_CMD" in
    init)
        CLI_ARGS=("init")
        ;;
    enable)
        if [ $# -eq 0 ]; then
            echo "Error: Tool name required" >&2
            exit 1
        fi
        CLI_ARGS=("enable" "$1")
        ;;
    disable)
        if [ $# -eq 0 ]; then
            echo "Error: Tool name required" >&2
            exit 1
        fi
        CLI_ARGS=("disable" "$1")
        ;;
    toggle)
        if [ $# -eq 0 ]; then
            echo "Error: Tool name required" >&2
            exit 1
        fi
        CLI_ARGS=("toggle" "$1")
        ;;
    status)
        CLI_ARGS=("status")
        ;;
    set-voice)
        if [ $# -eq 0 ]; then
            echo "Error: Voice name required" >&2
            exit 1
        fi
        CLI_ARGS=("set-voice" "$1")
        ;;
    set-rate)
        if [ $# -eq 0 ]; then
            echo "Error: Rate required" >&2
            exit 1
        fi
        CLI_ARGS=("set-rate" "$1")
        ;;
    set-volume)
        if [ $# -eq 0 ]; then
            echo "Error: Volume required" >&2
            exit 1
        fi
        CLI_ARGS=("set-volume" "$1")
        ;;
    list-voices)
        CLI_ARGS=("list-voices")
        ;;
    reset)
        CLI_ARGS=("reset")
        ;;
    language)
        CLI_ARGS=("language")
        ;;
    mute)
        if [ $# -eq 0 ]; then
            CLI_ARGS=("mute")
        else
            CLI_ARGS=("mute" "$1")
        fi
        ;;
    help)
        CLI_ARGS=("help")
        ;;
    *)
        echo "Error: Unknown skill command: $SKILL_CMD" >&2
        exit 1
        ;;
esac

# Execute CLI with mapped arguments
exec "$NODE_CMD" "$CLI_PATH" "${CLI_ARGS[@]}"