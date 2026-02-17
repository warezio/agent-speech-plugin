#!/bin/bash
# Skill: Set voice
# Description: Set the text-to-speech voice name

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

# Check if voice name provided
if [ $# -eq 0 ]; then
    echo "Error: Voice name required" >&2
    echo "Usage: skill-set-voice <voice>" >&2
    echo "Use 'skill-list-voices' to see available voices" >&2
    exit 1
fi

# Execute CLI set-voice command
exec "$NODE_CMD" "$CLI_PATH" "set-voice" "$1"