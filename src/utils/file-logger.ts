import { ConsoleLogger } from '@nestjs/common';
import { createWriteStream, WriteStream, mkdirSync, existsSync } from 'fs';
import { EOL } from 'os';
import * as path from 'path';

export class FileLogger extends ConsoleLogger {
  /**
   * Write a 'log' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */

  private fp: WriteStream;

  constructor(params: { file: string }) {
    super();
    const logdir = path.dirname(params.file);
    if (!existsSync(logdir)) {
      mkdirSync(logdir, { recursive: true });
    }
    this.fp = createWriteStream(params.file, { flags: 'a' });
  }

  private logToFile(level: string, context: string, message: string) {
    const date = new Date().toLocaleString();
    const pid = process.pid;
    const fmt = `${date} ${pid} ${level} ${
      context ? '[' + context + ']' : ''
    } ${message}`;
    this.fp.write(fmt + EOL);
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.logToFile('LOG', context, message);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.logToFile('ERROR', context, message);
    this.logToFile('ERROR', context, stack);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.logToFile('WARN', context, message);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.logToFile('DEBUG', context, message);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.logToFile('VERBOSE', context, message);
  }
}
