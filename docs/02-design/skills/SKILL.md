name: "agent-speech"
title: "Agent Speech Plugin - Text-to-Speech for AI CLI Tools"
version: "0.1.0"
description: |
  Convert AI responses from Claude Code, OpenCode, Codex-CLI, and Gemini-CLI into speech using macOS TTS.

  Features:
  - Text-to-speech conversion for AI CLI responses
  - Support for multiple CLI tools (Claude Code, OpenCode, Codex-CLI, Gemini-CLI)
  - Customizable voices, speech rate, and volume
  - Global and per-tool configuration
  - Mute functionality with time limits
  - Voice filtering for sensitive content

  Prerequisites:
  - macOS 10.15+
  - Node.js 18+
  - macOS Text-to-Speech voices

  Notes:
  - Requires node in PATH for execution
  - Configuration stored in ~/.agent-speech/config.json
  - Mute state stored in ~/.agent-speech/mute.json
  - First run will initialize configuration
commands:
  - name: "init"
    description: "Initialize configuration with defaults"
    usage: "skill-init"
    examples:
      - "skill-init"
      - "Initialize the agent-speech configuration"

  - name: "enable"
    description: "Enable TTS for a specific tool"
    usage: "skill-enable <tool>"
    parameters:
      - name: "tool"
        type: "string"
        description: "Tool name (claude-code, opencode, codex-cli, gemini-cli)"
        required: true
    examples:
      - "skill-enable claude-code"
      - "skill-enable opencode"

  - name: "disable"
    description: "Disable TTS for a specific tool"
    usage: "skill-disable <tool>"
    parameters:
      - name: "tool"
        type: "string"
        description: "Tool name (claude-code, opencode, codex-cli, gemini-cli)"
        required: true
    examples:
      - "skill-disable claude-code"
      - "skill-disable gemini-cli"

  - name: "toggle"
    description: "Toggle TTS on/off for a tool"
    usage: "skill-toggle <tool>"
    parameters:
      - name: "tool"
        type: "string"
        description: "Tool name (claude-code, opencode, codex-cli, gemini-cli)"
        required: true
    examples:
      - "skill-toggle claude-code"
      - "skill-toggle codex-cli"

  - name: "status"
    description: "Show current configuration status"
    usage: "skill-status"
    examples:
      - "skill-status"
      - "Display current settings and tool status"

  - name: "set-voice"
    description: "Set the voice name"
    usage: "skill-set-voice <voice>"
    parameters:
      - name: "voice"
        type: "string"
        description: "Voice name (e.g., Samantha, Alex, Victoria)"
        required: true
    examples:
      - "skill-set-voice Samantha"
      - "skill-set-voice Alex"

  - name: "set-rate"
    description: "Set speech rate in words per minute"
    usage: "skill-set-rate <wpm>"
    parameters:
      - name: "wpm"
        type: "number"
        description: "Speech rate (50-400)"
        required: true
    examples:
      - "skill-set-rate 200"
      - "skill-set-rate 150"

  - name: "set-volume"
    description: "Set volume (0-100)"
    usage: "skill-set-volume <volume>"
    parameters:
      - name: "volume"
        type: "number"
        description: "Volume level (0-100)"
        required: true
    examples:
      - "skill-set-volume 50"
      - "skill-set-volume 75"

  - name: "list-voices"
    description: "List available macOS voices"
    usage: "skill-list-voices"
    examples:
      - "skill-list-voices"
      - "Show all available TTS voices"

  - name: "reset"
    description: "Reset configuration to defaults"
    usage: "skill-reset"
    examples:
      - "skill-reset"
      - "Reset all settings to factory defaults"

  - name: "language"
    description: "Interactively select translation language"
    usage: "skill-language"
    examples:
      - "skill-language"
      - "Choose translation language for TTS"

  - name: "mute"
    description: "Mute TTS for duration or cancel mute"
    usage: "skill-mute [duration|off]"
    parameters:
      - name: "duration"
        type: "string"
        description: "Duration in minutes (e.g., 5, 30, 120) or 'off' to cancel"
        required: false
    examples:
      - "skill-mute 30"
      - "skill-mute 5"
      - "skill-mute off"
      - "skill-mute"

  - name: "help"
    description: "Show help information"
    usage: "skill-help"
    examples:
      - "skill-help"
      - "Display usage information and available commands"