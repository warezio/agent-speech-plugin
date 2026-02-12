# Agent Speech Plugin

> A plugin that provides audio guidance for Terminal CLI AI Agent responses

## 📋 Overview

A macOS-exclusive plugin that allows developers to hear responses via audio when using AI tools such as Claude Code, OpenCode, Codex-CLI, and Gemini-CLI in the terminal.

## 🎯 Supported CLI Tools

- [x] Claude Code
- [ ] OpenCode (Plan)
- [ ] Codex-CLI (Plan)
- [ ] Gemini-CLI (Plan)

## 🚧 Development Status

**Starter Level** - Only basic plugin features implemented (local TTS, simple configuration)

- [x] Phase 1: Plan (Completed)
- [x] Phase 2: Design (Completed)
- [ ] Phase 3: Implementation
- [ ] Phase 4: Testing
- [ ] Phase 5: Release

## 📁 Project Structure

```
agent-speech-plugin/
├── docs/
│   ├── 01-plan/
│   │   └── features/
│   │       └── agent-speech-plugin.plan.md    # Planning document
│   ├── 02-design/                            # Design document (Planned)
│   ├── 03-analysis/                          # Analysis document (Planned)
│   └── 04-report/                            # Completion report (Planned)
├── src/                                      # Source code (Planned)
├── config/                                   # Configuration file (Planned)
└── README.md
```

## 🔧 Key Features (Planned)

- macOS Native TTS (Utilizing `say` command)
- Adjust speech rate, volume, and voice
- ON/OFF toggle
- Persistent storage via configuration file
- Different configuration for each CLI tool

## 📝 License

MIT

---

**PDCA Status**: Design Phase ✅ | Next: `/pdca do agent-speech-plugin`
