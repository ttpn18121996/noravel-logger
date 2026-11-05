import type { LOG_LEVEL } from '../enums/log-level';

export interface LogChannel {
  name: string;
  driver: string;
  path: string;
  level?: LOG_LEVEL;
}
