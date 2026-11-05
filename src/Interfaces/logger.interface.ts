import type { LOG_LEVEL } from '../enums/log-level';
import type { LogChannel } from './channel.interface';
import type { LogConfig } from './config.interface';

export type Messageable = string | Error | { toString(): string };

export interface Logger {
  _config: LogConfig;
  _channels: LogChannel[];
  emergency: (message: Messageable, context: Record<string, string>) => void;
  alert: (message: Messageable, context: Record<string, string>) => void;
  critical: (message: Messageable, context: Record<string, string>) => void;
  error: (message: Messageable, context: Record<string, string>) => void;
  warning: (message: Messageable, context: Record<string, string>) => void;
  notice: (message: Messageable, context: Record<string, string>) => void;
  info: (message: Messageable, context: Record<string, string>) => void;
  debug: (message: Messageable, context: Record<string, string>) => void;
  log: (level: LOG_LEVEL, message: Messageable, context: Record<string, string>) => void;
}
