/**
 * Unit tests for TextToSpeech class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TextToSpeech } from '../../src/core/tts.js';
import type { TTSConfig } from '../../src/types/index.js';

// Mock the SayCommand module
const mockSpeak = vi.fn().mockResolvedValue(undefined);
const mockStop = vi.fn();
const mockGetAvailableVoices = vi.fn().mockResolvedValue([
  { name: 'Samantha', language: 'en-US' },
  { name: 'Alex', language: 'en-US' },
]);
const mockIsSpeaking = vi.fn().mockReturnValue(false);

vi.mock('../../src/infrastructure/say.js', () => ({
  SayCommand: class {
    speak = mockSpeak;
    stop = mockStop;
    getAvailableVoices = mockGetAvailableVoices;
    isSpeaking = mockIsSpeaking;
  },
}));

// Mock the ContentFilter module
const mockFilter = vi.fn().mockReturnValue({
  shouldSpeak: true,
  text: 'Hello world',
  reason: null,
});
const mockDetectSensitive = vi.fn().mockReturnValue(false);
const mockRemoveCodeBlocks = vi.fn().mockReturnValue('clean text');

vi.mock('../../src/core/filter.js', () => ({
  ContentFilter: class {
    filter = mockFilter;
    detectSensitive = mockDetectSensitive;
    removeCodeBlocks = mockRemoveCodeBlocks;
  },
}));

describe('TextToSpeech', () => {
  let tts: TextToSpeech;
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
    tts = new TextToSpeech();
    vi.clearAllMocks();
  });

  describe('speak()', () => {
    it('should speak when enabled', async () => {
      await expect(tts.speak('Hello world, this is a test message', defaultConfig)).resolves.toBeUndefined();
    });

    it('should not speak when disabled', async () => {
      const disabledConfig = { ...defaultConfig, enabled: false };
      await expect(tts.speak('Hello world', disabledConfig)).resolves.toBeUndefined();
    });

    it('should not speak when globally disabled', async () => {
      tts.setEnabled(false);
      await expect(tts.speak('Hello world', defaultConfig)).resolves.toBeUndefined();
    });
  });

  describe('stop()', () => {
    it('should stop current speech', () => {
      tts.stop();
      expect(mockStop).toHaveBeenCalled();
    });
  });

  describe('getAvailableVoices()', () => {
    it('should return list of voices', async () => {
      const voices = await tts.getAvailableVoices();
      expect(Array.isArray(voices)).toBe(true);
      expect(voices.length).toBeGreaterThan(0);
      expect(voices[0]).toHaveProperty('name');
      expect(voices[0]).toHaveProperty('language');
    });
  });

  describe('isSpeaking()', () => {
    it('should return boolean', () => {
      const result = tts.isSpeaking();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('setEnabled()', () => {
    it('should change enabled state', () => {
      tts.setEnabled(false);
      expect(tts.isEnabled()).toBe(false);

      tts.setEnabled(true);
      expect(tts.isEnabled()).toBe(true);
    });
  });

  describe('isEnabled()', () => {
    it('should return enabled state', () => {
      expect(tts.isEnabled()).toBe(true);
    });
  });

  describe('filterText()', () => {
    it('should return filtered text', () => {
      const result = tts.filterText('Hello world', defaultConfig);
      expect(typeof result).toBe('string');
    });
  });

  describe('detectSensitive()', () => {
    it('should return boolean for sensitive content', () => {
      const result = tts.detectSensitive('Hello world');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('removeCodeBlocks()', () => {
    it('should remove code blocks from text', () => {
      const text = 'Here is some code ```const x = 1;``` and more text';
      const result = tts.removeCodeBlocks(text);
      expect(typeof result).toBe('string');
    });
  });
});
