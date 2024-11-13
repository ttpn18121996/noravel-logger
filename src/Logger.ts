import fs from 'node:fs';
import { join } from 'node:path';
import moment from 'moment';
import { _str } from '@noravel/supporter';
import ILogger, { LOG_LEVEL } from './Interfaces/ILogger';
import ILoggerConfig from './Interfaces/ILoggerConfig';
import LogColor from './LogColor';

export default class Logger implements ILogger {
  private static _instance: Logger;
  public _config: ILoggerConfig;

  private constructor() {
    this._config = {
      driver: 'single',
      path: process.cwd(),
    };
  }

  public static getInstance(config: Record<string, string> = {}): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    Logger._instance.configure(config);

    return Logger._instance;
  }

  public configure(config: Record<string, string> = {}) {
    this._config = { ...this._config, ...config };
  }

  public emergency(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.EMERGENCY, message, context);
  }

  public alert(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.ALERT, message, context);
  }

  public critical(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.CRITICAL, message, context);
  }

  public error(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.ERROR, message, context);
  }

  public warning(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.WARNING, message, context);
  }

  public notice(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.NOTICE, message, context);
  }

  public info(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.INFO, message, context);
  }

  public debug(message: string, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.DEBUG, message, context);
  }

  public log(level: LOG_LEVEL, message: string, context: Record<string, string> = {}) {
    message = _str(message).bind(context).toString();
    const now = this.nowFormated();

    console.log(
      `[${now}] ` +
        ((
          {
            [LOG_LEVEL.EMERGENCY]: LogColor.bgRed('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.ALERT]: LogColor.bgYellow('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.CRITICAL]: LogColor.white('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.ERROR]: LogColor.red('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.WARNING]: LogColor.yellow('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.NOTICE]: LogColor.magenta('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.INFO]: LogColor.green('[' + LOG_LEVEL[level] + ']'),
            [LOG_LEVEL.DEBUG]: LogColor.blue('[' + LOG_LEVEL[level] + ']'),
          } as Record<string, string>
        )[level] ?? '') +
        ` ${message}`,
    );

    this.appendFile(`[${now}] [${LOG_LEVEL[level]}] ${message}`);
  }

  public nowFormated(): string {
    if (this._config.driver === 'daily') {
      return this.timeFormated();
    }

    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  public dateFormated(): string {
    return moment().format('YYYY-MM-DD');
  }

  public timeFormated(): string {
    return moment().format('HH:mm:ss');
  }

  public appendFile(content: string) {
    let fileName = 'single_log.log';

    if (this._config.driver === 'daily') {
      fileName = this.dateFormated() + '.log';
    }

    const filePath = join(this._config.path, fileName);

    fs.appendFile(filePath, content + '\n', err => {
      if (err) console.log(err.message);
    });
  }
}
