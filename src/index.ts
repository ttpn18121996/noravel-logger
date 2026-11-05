import BaseLogger from './logger';
import LogColor from './log-color';
import { LOG_LEVEL } from './enums/log-level';

const Logger = BaseLogger.getInstance({});

export { Logger, LogColor, LOG_LEVEL };
