import ILoggerConfig from './ILoggerConfig';

export enum LOG_LEVEL {
  EMERGENCY,
  ALERT,
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
}

export interface IChannel {
  name: string;
  driver: string;
  path: string;
  level?: LOG_LEVEL;
}

export type Messageable = string | Error | { toString(): string };

export default interface ILogger {
  _config: ILoggerConfig;
  _channels: IChannel[];
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
