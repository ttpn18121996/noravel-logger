export default class LogColor {
  public static black(message: string) {
    return `\x1b[30m${message}\x1b[0m`;
  }

  public static red(message: string) {
    return `\x1b[31m${message}\x1b[0m`;
  }

  public static green(message: string) {
    return `\x1b[32m${message}\x1b[0m`;
  }

  public static yellow(message: string) {
    return `\x1b[33m${message}\x1b[0m`;
  }

  public static blue(message: string) {
    return `\x1b[34m${message}\x1b[0m`;
  }

  public static magenta(message: string) {
    return `\x1b[35m${message}\x1b[0m`;
  }

  public static cyan(message: string) {
    return `\x1b[36m${message}\x1b[0m`;
  }

  public static white(message: string) {
    return `\x1b[37m${message}\x1b[0m`;
  }

  public static bgBlack(message: string) {
    return `\x1b[40m${message}\x1b[0m`;
  }

  public static bgRed(message: string) {
    return `\x1b[41m${message}\x1b[0m`;
  }

  public static bgGreen(message: string) {
    return `\x1b[42m${message}\x1b[0m`;
  }

  public static bgYellow(message: string) {
    return `\x1b[43m${message}\x1b[0m`;
  }

  public static bgBlue(message: string) {
    return `\x1b[44m${message}\x1b[0m`;
  }

  public static bgMagenta(message: string) {
    return `\x1b[45m${message}\x1b[0m`;
  }

  public static bgCyan(message: string) {
    return `\x1b[46m${message}\x1b[0m`;
  }

  public static bgWhite(message: string) {
    return `\x1b[47m${message}\x1b[0m`;
  }
}
