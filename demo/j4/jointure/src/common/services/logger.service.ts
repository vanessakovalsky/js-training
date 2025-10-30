// === SERVICE DE LOGGING ===

import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  log(message: string) {
    console.log(this.formatMessage('INFO', message));
  }

  error(message: string, trace?: string) {
    console.error(this.formatMessage('ERROR', message));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string) {
    console.warn(this.formatMessage('WARN', message));
  }

  debug(message: string) {
    console.debug(this.formatMessage('DEBUG', message));
  }
}