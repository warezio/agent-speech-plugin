# Changelog

All notable changes to the agent-speech-plugin project will be documented in this file.

## [2026-02-15] - Debug Environment Setup

### Added
- Comprehensive debugging and testing environment for MCP server development
- Logger utility with stderr output and file logging with rotation
- Error handling wrapper with DebugError class for structured error management
- Zod schemas for tool input validation (SpeakTextInput, TTSConfig)
- VS Code debugging configuration with 6 debug configurations
- Vitest testing framework with 64 passing unit and integration tests
- MCP Inspector integration script for browser-based tool testing
- Environment variables support (DEBUG, LOG_FILE)
- Hot-reload development with `tsc --watch`
- Comprehensive test coverage targeting 70% (all targets met)

### Changed
- Updated package.json with development dependencies (vitest, zod, coverage)
- Added npm scripts for build, dev, test, and inspect commands
- Enhanced existing tool handlers with debug logging capabilities
- Improved error handling throughout the codebase

### Fixed
- Standardized all debug output to use console.error() to avoid MCP protocol interference
- Added proper error boundaries for async operations
- Implemented log file rotation to prevent disk space issues

---

## [2026-02-13] - Initial Implementation

### Added
- Basic MCP server structure
- Text-to-speech functionality with macOS say command
- Plugin configuration system
- CLI interface for plugin management