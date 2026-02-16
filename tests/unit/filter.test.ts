/**
 * Unit tests for ContentFilter class
 */

import { describe, it, expect } from 'vitest';
import { ContentFilter } from '../../src/core/filter.js';
import type { TTSConfig } from '../../src/types/index.js';

describe('ContentFilter', () => {
  let filter: ContentFilter;
  const defaultConfig: TTSConfig = {
    enabled: true,
    voice: 'Samantha',
    rate: 200,
    volume: 50,
    minLength: 10,
    maxLength: 0,
    filters: {
      sensitive: false,
      skipCodeBlocks: false,
      skipCommands: false,
    },
  };

  beforeEach(() => {
    filter = new ContentFilter();
  });

  describe('filter()', () => {
    it('should pass through text when filters are disabled', () => {
      const result = filter.filter('Hello world, this is a test', defaultConfig);
      expect(result.shouldSpeak).toBe(true);
      expect(result.text).toBe('Hello world, this is a test');
    });

    it('should skip text below min length', () => {
      const config = { ...defaultConfig, minLength: 20 };
      const result = filter.filter('Short text', config);
      expect(result.shouldSpeak).toBe(false);
      expect(result.reason).toContain('below minimum');
    });

    it('should skip empty text', () => {
      const result = filter.filter('', defaultConfig);
      expect(result.shouldSpeak).toBe(false);
    });

    it('should skip whitespace only text', () => {
      const result = filter.filter('   \n\t  ', defaultConfig);
      expect(result.shouldSpeak).toBe(false);
    });
  });

  describe('removeCodeBlocks()', () => {
    it('should remove markdown code blocks', () => {
      const input = 'Hello ```const x = 1;``` world';
      const result = filter.removeCodeBlocks(input);
      expect(result).toBe('Hello  world');
    });

    it('should handle multiple code blocks', () => {
      const input = '```code1``` text ```code2```';
      const result = filter.removeCodeBlocks(input);
      expect(result).not.toContain('code1');
      expect(result).not.toContain('code2');
    });

    it('should also remove inline code (backtick pattern)', () => {
      const input = 'Use `const x = 1` for variables';
      const result = filter.removeCodeBlocks(input);
      // The pattern includes inline code, so it should be removed
      expect(result).not.toContain('const x = 1');
    });

    it('should remove shell command patterns', () => {
      // The pattern requires actual $ at both ends
      const input = 'Run $npm install$ to install';
      const result = filter.removeCodeBlocks(input);
      // Pattern is /\$[^$]+$/g which matches $...$
      expect(result).not.toContain('$npm install$');
    });
  });

  describe('detectSensitive()', () => {
    it('should detect API key patterns', () => {
      const text = 'Your API key is sk-1234567890abcdef';
      const result = filter.detectSensitive(text);
      expect(result).toBe(true);
    });

    it('should detect password patterns', () => {
      const text = 'password: secret123';
      const result = filter.detectSensitive(text);
      expect(result).toBe(true);
    });

    it('should detect token patterns', () => {
      const text = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const result = filter.detectSensitive(text);
      expect(result).toBe(true);
    });

    it('should return false for normal text', () => {
      const text = 'Hello world, this is a normal message';
      const result = filter.detectSensitive(text);
      expect(result).toBe(false);
    });
  });

  describe('removeCommandOutputs()', () => {
    it('should remove diff/output separators', () => {
      const input = 'Some text\n---\noutput\n---\nmore text';
      const result = filter.removeCommandOutputs(input);
      expect(result).not.toContain('---');
    });

    it('should remove build status lines', () => {
      const input = 'Building...\nSUCCESS\nDone';
      const result = filter.removeCommandOutputs(input);
      expect(result).not.toContain('SUCCESS');
    });

    it('should preserve normal text', () => {
      const input = 'This is normal text with no command outputs';
      const result = filter.removeCommandOutputs(input);
      expect(result).toBe(input);
    });
  });
});
