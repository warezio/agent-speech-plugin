#!/bin/bash
# Skill: Mute TTS
# Description: Mute text-to-speech for duration or cancel mute

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

# Execute CLI mute command (with optional parameter)
if [ $# -eq 0 ]; then
    exec "$NODE_CMD" "$CLI_PATH" "mute"
else
    exec "$NODE_CMD" "$CLI_PATH" "mute" "$1"
fi