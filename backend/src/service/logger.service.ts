import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import * as path from 'path';

@Injectable()
export class CustomLogger implements LoggerService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
                new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
            ],
        });
    }

    log(message: any) {
        this.logger.info(message);
    }

    error(message: any, trace?: string) {
        this.logger.error(message);
    }

    warn(message: any) {
        this.logger.warn(message);
    }

    // Add more methods as needed
}
