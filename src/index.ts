import BaseLogger from './Logger';
import LogColor from './LogColor';
import { LOG_LEVEL } from './Interfaces/ILogger';

const Logger = BaseLogger.getInstance();

export { Logger, LogColor, LOG_LEVEL };
