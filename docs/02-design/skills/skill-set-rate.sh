#!/bin/bash
# Skill: Set speech rate
# Description: Set speech rate in words per minute

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

# Check if rate provided
if [ $# -eq 0 ]; then
    echo "Error: Speech rate required" >&2
    echo "Usage: skill-set-rate <wpm>" >&2
    echo "Range: 50-400 words per minute" >&2
    exit 1
fi

# Validate rate is numeric
if ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "Error: Rate must be a number" >&2
    exit 1
fi

# Execute CLI set-rate command
exec "$NODE_CMD" "$CLI_PATH" "set-rate" "$1"