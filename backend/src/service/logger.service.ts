import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class CustomLogger implements LoggerService {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.prettyPrint(),
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'application.log' }),
    ],
  });

  log(message: any) {
    this.logger.info(message);
  }

  error(message: any, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: any) {
    this.logger.warn(message);
  }
}