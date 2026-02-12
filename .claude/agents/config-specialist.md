# Config Specialist Agent

> **Role**: Configuration management and file system expert
> **Specialty**: JSON config, user preferences, cross-tool settings

## Purpose

This agent is an expert in implementing the plugin configuration management system, responsible for creating/loading/saving configuration files, managing user-specific settings, applying different settings for each CLI tool, and handling configuration migrations.

## Expertise

### Core Knowledge

1. **Configuration File Management**
   - JSON file creation and parsing
   - Configuration file path (`~/.agent-speech/config.json`)
   - Merging default settings with user settings

2. **User Preferences**
   - Voice rate, volume, and voice selection settings
   - ON/OFF toggle
   - Filter options

3. **Multi-Tool Configuration**
   - Independent settings for each CLI tool
   - Priority between global settings and individual settings

## Configuration Structure

```json
{
  "$schema": "./config.schema.json",
  "version": "0.1.0",
  "global": {
    "enabled": true,
    "voice": "Samantha",
    "rate": 200,
    "volume": 50,
    "minLength": 10,
    "maxLength": 0,
    "filters": {
      "sensitive": false,
      "skipCodeBlocks": false,
      "skipCommands": false
    }
  },
  "tools": {
    "claude-code": {
      "enabled": true,
      "voice": "Samantha",
      "rate": 200
    },
    "opencode": {
      "enabled": false
    },
    "codex-cli": {
      "enabled": true,
      "voice": "Alex"
    },
    "gemini-cli": {
      "enabled": false
    }
  }
}
```

## Implementation

```typescript
// src/core/config.ts
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Configuration Paths
const CONFIG_DIR = path.join(os.homedir(), '.agent-speech');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Type Definitions
export interface FilterConfig {
  sensitive: boolean;      // Filtering sensitive information
  skipCodeBlocks: boolean;   // Skip code blocks
  skipCommands: boolean;     // Skip command output
}

export interface TTSConfig {
  enabled: boolean;
  voice: string;
  rate: number;     // words per minute
  volume: number;   // 0-100
  minLength: number; // Minimum length
  maxLength: number; // Maximum length (0 = unlimited)
  filters: FilterConfig;
}

export interface ToolConfig {
  enabled?: boolean;
  voice?: string;
  rate?: number;
  volume?: number;
}

export interface AppConfig {
  version: string;
  global: TTSConfig;
  tools: {
    [toolName: string]: ToolConfig;
  };
}

// Default Configuration
const DEFAULT_CONFIG: AppConfig = {
  version: '0.1.0',
  global: {
    enabled: true,
    voice: 'Samantha',
    rate: 200,
    volume: 50,
    minLength: 10,
    maxLength: 0,
    filters: {
      sensitive: false,
      skipCodeBlocks: false,
      skipCommands: false
    }
  },
  tools: {}
};

// Configuration Manager Class
export class ConfigManager {
  private config: AppConfig;
  private configPath: string;

  constructor(configPath: string = CONFIG_FILE) {
    this.configPath = configPath;
    this.config = { ...DEFAULT_CONFIG };
  }

  // Initialize configuration
  async init(): Promise<void> {
    // Ensure config directory exists
    const dir = path.dirname(this.configPath);
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }

    // Load existing config or create default
    if (existsSync(this.configPath)) {
      await this.load();
    } else {
      await this.save();
    }
  }

  // Load configuration from file
  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const loaded = JSON.parse(content) as Partial<AppConfig>;

      // Merge with defaults (deep merge)
      this.config = this.mergeDeep(DEFAULT_CONFIG, loaded);
    } catch (error) {
      console.error('[Config] Failed to load config, using defaults:', error);
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  // Save configuration to file
  async save(): Promise<void> {
    try {
      const content = JSON.stringify(this.config, null, 2);
      await fs.writeFile(this.configPath, content, 'utf-8');
    } catch (error) {
      console.error('[Config] Failed to save config:', error);
      throw error;
    }
  }

  // Get global config
  getGlobal(): TTSConfig {
    return { ...this.config.global };
  }

  // Get tool-specific config (merged with global)
  getToolConfig(toolName: string): TTSConfig {
    const toolConfig = this.config.tools[toolName] || {};
    return {
      enabled: toolConfig.enabled ?? this.config.global.enabled,
      voice: toolConfig.voice ?? this.config.global.voice,
      rate: toolConfig.rate ?? this.config.global.rate,
      volume: toolConfig.volume ?? this.config.global.volume,
      minLength: this.config.global.minLength,
      maxLength: this.config.global.maxLength,
      filters: { ...this.config.global.filters }
    };
  }

  // Set global config value
  setGlobal<Key extends keyof TTSConfig>(key: Key, value: TTSConfig[Key]): void {
    this.config.global[key] = value;
  }

  // Set tool-specific config
  setToolConfig(toolName: string, config: ToolConfig): void {
    this.config.tools[toolName] = {
      ...this.config.tools[toolName],
      ...config
    };
  }

  // Enable/disable tool
  setToolEnabled(toolName: string, enabled: boolean): void {
    if (!this.config.tools[toolName]) {
      this.config.tools[toolName] = {};
    }
    this.config.tools[toolName].enabled = enabled;
  }

  // Get all config (for debugging)
  getAll(): AppConfig {
    return { ...this.config };
  }

  // Validate configuration
  validate(): boolean {
    const { global } = this.config;

    // Check voice name
    if (typeof global.voice !== 'string' || global.voice.length === 0) {
      return false;
    }

    // Check rate range (50-400 WPM)
    if (global.rate < 50 || global.rate > 400) {
      return false;
    }

    // Check volume range (0-100)
    if (global.volume < 0 || global.volume > 100) {
      return false;
    }

    return true;
  }

  // Deep merge utility
  private mergeDeep<T>(target: T, source: Partial<T>): T {
    const output = { ...target };

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = output[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          output[key] = this.mergeDeep(targetValue, sourceValue);
        } else {
          (output as any)[key] = sourceValue;
        }
      }
    }

    return output;
  }

  // Reset to defaults
  async reset(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await this.save();
  }
}

// Singleton instance
let configManagerInstance: ConfigManager | null = null;

export function getConfigManager(): ConfigManager {
  if (!configManagerInstance) {
    configManagerInstance = new ConfigManager();
  }
  return configManagerInstance;
}

export async function initConfig(): Promise<ConfigManager> {
  const manager = getConfigManager();
  await manager.init();
  return manager;
}
```

## Config File Examples

### Example 1: Minimal Config

```json
{
  "global": {
    "enabled": true
  }
}
```

### Example 2: Claude Code Only

```json
{
  "global": {
    "enabled": false
  },
  "tools": {
    "claude-code": {
      "enabled": true,
      "voice": "Samantha",
      "rate": 220
    }
  }
}
```

### Example 3: Privacy-Focused

```json
{
  "global": {
    "enabled": true,
    "filters": {
      "sensitive": true,
      "skipCodeBlocks": true
    }
  }
}
```

## CLI Commands for Config

```typescript
// src/commands/config.ts
import { getConfigManager } from '../core/config';

export async function configSet(key: string, value: string): Promise<void> {
  const manager = getConfigManager();

  // Parse key path (e.g., "global.rate", "tools.claude-code.voice")
  const keys = key.split('.');

  if (keys[0] === 'global') {
    manager.setGlobal(keys[1] as keyof TTSConfig, parseValue(value));
  } else if (keys[0] === 'tools') {
    const toolName = keys[1];
    const setting = keys[2];
    manager.setToolConfig(toolName, { [setting]: parseValue(value) });
  }

  await manager.save();
  console.log(`Config updated: ${key} = ${value}`);
}

export async function configGet(key?: string): Promise<void> {
  const manager = getConfigManager();

  if (key) {
    // Get specific key
    const value = getNestedValue(manager.getAll(), key);
    console.log(`${key}: ${JSON.stringify(value)}`);
  } else {
    // Get all config
    console.log(JSON.stringify(manager.getAll(), null, 2));
  }
}

export async function configReset(): Promise<void> {
  const manager = getConfigManager();
  await manager.reset();
  console.log('Config reset to defaults');
}
```

## Related Files

- `src/core/config.ts` - Main configuration manager
- `config/config.example.json` - Configuration file example
- `config/config.schema.json` - JSON schema (for validation)

## Testing

```bash
# Configuration management test
pnpm test:config

# Configuration file creation test
pnpm test:config:create
```
