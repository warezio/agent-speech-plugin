/**
 * Unit tests for Logger utility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import { createLogger, type Logger } from '../../src/utils/logger.js';

describe('Logger', () => {
  const testLogFile = '/tmp/agent-speech-test.log';

  beforeEach(() => {
    // Clean up test log file
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }
    // Clean up backup files
    for (let i = 1; i <= 3; i++) {
      const backupFile = `${testLogFile}.${i}`;
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
      }
    }
  });

  afterEach(() => {
    // Clean up test log file
    if (fs.existsSync(testLogFile)) {
      fs.unlinkSync(testLogFile);
    }
    // Clean up backup files
    for (let i = 1; i <= 3; i++) {
      const backupFile = `${testLogFile}.${i}`;
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
      }
    }
  });

  describe('debug()', () => {
    it('should output to stderr when enabled', () => {
      const logger = createLogger({ enabled: true, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('test message', { data: 'value' });

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] [DEBUG] test message'), { data: 'value' });

      spy.mockRestore();
    });

    it('should not output when disabled', () => {
      const logger = createLogger({ enabled: false, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('test message');

      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should not output when level is higher than debug', () => {
      const logger = createLogger({ enabled: true, level: 'info', output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('test message');

      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('info()', () => {
    it('should output info messages', () => {
      const logger = createLogger({ enabled: true, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.info('info message');

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[INFO] info message'));

      spy.mockRestore();
    });
  });

  describe('warn()', () => {
    it('should output warning messages', () => {
      const logger = createLogger({ enabled: true, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.warn('warning message');

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[WARN] warning message'));

      spy.mockRestore();
    });
  });

  describe('error()', () => {
    it('should output error messages', () => {
      const logger = createLogger({ enabled: true, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('error message', { error: 'details' });

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] error message'), { error: 'details' });

      spy.mockRestore();
    });
  });

  describe('file logging', () => {
    it('should write to file when output is "file"', () => {
      const logger = createLogger({ enabled: true, output: 'file', filePath: testLogFile });

      logger.info('test message');

      expect(fs.existsSync(testLogFile)).toBe(true);
    });

    it('should write JSON entries to file', () => {
      const logger = createLogger({ enabled: true, output: 'file', filePath: testLogFile });

      logger.info('test message', { key: 'value' });

      const content = fs.readFileSync(testLogFile, 'utf-8');
      const entry = JSON.parse(content.trim());

      expect(entry.level).toBe('info');
      expect(entry.message).toBe('test message');
      expect(entry.data).toEqual({ key: 'value' });
    });
  });

  describe('log levels', () => {
    it('should respect log level hierarchy', () => {
      const logger = createLogger({ enabled: true, level: 'warn', output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(spy).toHaveBeenCalledTimes(2); // warn and error only

      spy.mockRestore();
    });

    it('should output all levels when set to debug', () => {
      const logger = createLogger({ enabled: true, level: 'debug', output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      expect(spy).toHaveBeenCalledTimes(4);

      spy.mockRestore();
    });
  });

  describe('log rotation', () => {
    it('should create backup file when size limit is reached', () => {
      const maxSize = 1024; // 1KB for testing
      const logger = createLogger({
        enabled: true,
        output: 'file',
        filePath: testLogFile,
        maxSize,
        maxFiles: 3,
      });

      // Write enough data to exceed the limit
      const largeMessage = 'x'.repeat(500);
      for (let i = 0; i < 10; i++) {
        logger.info(largeMessage);
      }

      // Check that backup was created
      expect(fs.existsSync(`${testLogFile}.1`)).toBe(true);
    });
  });

  describe('enable()', () => {
    it('should toggle logging on/off', () => {
      const logger = createLogger({ enabled: true, output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.enable(false);
      logger.debug('test message');
      expect(spy).not.toHaveBeenCalled();

      logger.enable(true);
      logger.debug('test message');
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('setLevel()', () => {
    it('should change log level', () => {
      const logger = createLogger({ enabled: true, level: 'info', output: 'stderr' });
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.debug('debug message');
      expect(spy).not.toHaveBeenCalled();

      logger.setLevel('debug');
      logger.debug('debug message');
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });
  });
});
