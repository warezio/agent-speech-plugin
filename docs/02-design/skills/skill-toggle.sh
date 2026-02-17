#!/bin/bash
# Skill: Toggle TTS for tool
# Description: Toggle text-to-speech on/off for a specific CLI tool

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

# Check if tool name provided
if [ $# -eq 0 ]; then
    echo "Error: Tool name required" >&2
    echo "Usage: skill-toggle <tool>" >&2
    echo "Available tools: claude-code, opencode, codex-cli, gemini-cli" >&2
    exit 1
fi

# Execute CLI toggle command
exec "$NODE_CMD" "$CLI_PATH" "toggle" "$1"