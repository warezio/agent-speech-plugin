/**
 * Show configuration status command
 */

import { readJSON, getConfigDir } from '../infrastructure/fs.js';
import { ConfigManager } from '../core/config.js';
import { format, formatListItem } from '../utils/format.js';
import { existsSync } from 'fs';
import { promises } from 'fs';

/**
 * Supported tools
 */
const TOOLS = ['claude-code', 'opencode', 'codex-cli', 'gemini-cli'] as const;

/**
 * Show configuration status
 * @returns Exit code (0 = success)
 */
export async function cmdStatus(): Promise<number> {
  const config = new ConfigManager();
  await config.init();

  format('Configuration status:');
  format('  version:', config.getVersion());
  format('');

  format('Global settings:');
  const global = config.getGlobal();
  format('  enabled:', global.enabled);
  format('  voice:', global.voice);
  format('  rate:', global.rate, 'WPM');
  format('  volume:', global.volume);
  format('  min length:', global.minLength);
  format('  max length:', global.maxLength || 'unlimited');
  format('  filters:');
  format('    sensitive:', global.filters.sensitive);
  format('    skipCodeBlocks:', global.filters.skipCodeBlocks);
  format('    skipCommands:', global.filters.skipCommands);
  format('');

  format('Tool status:');
  for (const tool of TOOLS) {
    const enabled = config.isToolEnabled(tool);
    formatListItem(`${tool}: ${enabled ? 'enabled' : 'disabled'}`, enabled);
  }
  format('');

  // Show mute status
  const MUTE_PATH = `${getConfigDir()}/mute.json`;

  format('Mute status:');
  if (existsSync(MUTE_PATH)) {
    try {
      const muteData = await readJSON(MUTE_PATH) as { until: string | null; duration: string };
      if (muteData.until === null) {
        formatListItem('muted: permanent', false);
      } else {
        const now = new Date();
        const expiry = new Date(muteData.until);
        const remaining = expiry.getTime() - now.getTime();

        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;

          let timeStr;
          if (hours > 0) {
            timeStr = `${hours} hour${hours > 1 ? 's' : ''} and ${mins} minute${mins > 1 ? 's' : ''}`;
          } else {
            timeStr = `${minutes} minute${minutes > 1 ? 's' : ''}`;
          }

          formatListItem(`muted: ${timeStr} remaining`, false);
        } else {
          // Mute expired
          promises.unlink(MUTE_PATH);
          formatListItem('muted: expired (auto-removed)', true);
        }
      }
    } catch (error) {
      // Corrupt mute file, remove it
      promises.unlink(MUTE_PATH);
      formatListItem('muted: file removed (corrupt)', true);
    }
  } else {
    formatListItem('muted: off', true);
  }

  return 0;
}
