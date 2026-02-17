#!/bin/bash
# Skill: Set volume
# Description: Set audio volume (0-100)

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

# Check if volume provided
if [ $# -eq 0 ]; then
    echo "Error: Volume required" >&2
    echo "Usage: skill-set-volume <volume>" >&2
    echo "Range: 0-100" >&2
    exit 1
fi

# Validate volume is numeric
if ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "Error: Volume must be a number" >&2
    exit 1
fi

# Execute CLI set-volume command
exec "$NODE_CMD" "$CLI_PATH" "set-volume" "$1"