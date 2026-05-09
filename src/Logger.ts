import fs from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'date-fns';
import { _arr, _str } from '@noravel/supporter';
import ILogger, { IChannel, LOG_LEVEL, Messageable } from './Interfaces/ILogger';
import ILoggerConfig from './Interfaces/ILoggerConfig';
import LogColor from './LogColor';

export default class Logger implements ILogger {
  private static _instance: Logger;
  public _config: ILoggerConfig;
  public _channels: IChannel[];

  private constructor() {
    this._config = {
      channel: 'single',
      path: process.cwd(),
      prefix: '',
      days: 14,
    };

    this._channels = [
      {
        name: 'single',
        driver: 'single',
        path: '',
      },
      {
        name: 'daily',
        driver: 'daily',
        path: '',
      },
    ];
  }

  public static getInstance(config: Record<string, string> = {}): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    Logger._instance.configure(config);

    return Logger._instance;
  }

  public configure(config: Record<string, unknown> = {}): this {
    this._config = { ...this._config, ...config };

    return this;
  }

  public addChannel(channel: IChannel): this {
    this._channels.push(channel);

    return this;
  }

  public emergency(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.EMERGENCY, message, context);
  }

  public alert(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.ALERT, message, context);
  }

  public critical(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.CRITICAL, message, context);
  }

  public error(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.ERROR, message, context);
  }

  public warning(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.WARNING, message, context);
  }

  public notice(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.NOTICE, message, context);
  }

  public info(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.INFO, message, context);
  }

  public debug(message: Messageable, context: Record<string, string> = {}) {
    this.log(LOG_LEVEL.DEBUG, message, context);
  }

  public log(level: LOG_LEVEL, message: Messageable, context: Record<string, string> = {}) {
    if (message instanceof Error) {
      message = message.stack || message.name + ': ' + message.message;
    } else if (
      typeof message === 'string' ||
      (typeof message === 'object' && typeof message.toString === 'function' && 'toString' in message)
    ) {
      message = _str((typeof message.toString === 'function' ? message.toString() : message) as string)
        .bind(context)
        .toString();
    }
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

    this.appendFile(`[${now}] [${LOG_LEVEL[level]}] ${message}`, level);
  }

  public nowFormated(): string {
    const { driver } = this.getChannel();

    if (driver === 'daily') {
      return this.timeFormated();
    }

    return format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
  }

  public dateFormated(): string {
    return format(Date.now(), 'yyyy-MM-dd');
  }

  public timeFormated(): string {
    return format(Date.now(), 'HH:mm:ss');
  }

  public async appendFile(content: string, level: LOG_LEVEL) {
    if (!this.validLevel(level)) {
      return;
    }

    const storagePath = this._config.path;
    const prefix = this._config.prefix;
    let { name, path: channelPath } = this.getChannel();

    const fileName = _str(name)
      .prepend(prefix + '-')
      .replace(/^\-/, '');

    if (this.isDaily()) {
      fileName.append('-' + this.dateFormated());
    }

    const folderPath = join(storagePath, channelPath);
    const filePath = join(folderPath, fileName.append('.log').toString());

    await fs.mkdir(folderPath, { recursive: true });

    try {
      await fs.access(filePath);
    } catch (error) {
      if (this.isDaily()) {
        await this.cleanupOldLogs(fileName.toString(), folderPath);
      }
    }

    await fs.appendFile(filePath, content + '\n').catch(err => {
      if (err) console.log(err.message);
    });
  }

  public async cleanupOldLogs(fileName: string, folderPath: string) {
    const files = await fs.readdir(folderPath);
    const prefixFileName = fileName.replace(/-\d{4}-\d{2}-\d{2}\.log$/, '');
    const now = Date.now();

    for (const file of files) {
      const match = file.match(new RegExp(`^${prefixFileName}-(\\d{4}-\\d{2}-\\d{2})\\.log$`));
      if (!match) {
        continue;
      }

      const date = new Date(match[1]);

      const ageInDays = (now - date.getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays > this._config.days) {
        const fullPath = join(folderPath, file);
        await fs.unlink(fullPath);
      }
    }
  }

  public getChannel() {
    const { channel: channelDefault } = this._config;

    return (
      this._channels.find(channel => channel.name === channelDefault) ?? {
        name: 'single',
        driver: 'single',
        path: '',
      }
    );
  }

  private isDaily() {
    return this.getChannel().driver === 'daily';
  }

  private validLevel(currentLevel: LOG_LEVEL) {
    const channel = this.getChannel();
    const level = channel?.level ?? LOG_LEVEL.DEBUG;
    const groupFiles = _arr().range(level, LOG_LEVEL.EMERGENCY).toArray();

    return groupFiles.includes(currentLevel);
  }

  public channel(name: string) {
    const logger = this.replicate();
    logger.configure({
      channel: name,
    });

    return logger;
  }

  public replicate() {
    const newInstance = this.newInstance();
    newInstance._config = { ...this._config };
    newInstance._channels = [...this._channels];

    return newInstance;
  }

  public newInstance() {
    return new Logger();
  }
}
