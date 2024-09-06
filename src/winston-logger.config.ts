// src/winston-logger.config.ts
import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(), 
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs', 
      filename: '%DATE%.log', 
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '14d', 
      level: 'info', 
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), 
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs/error', 
      filename: '%DATE%-error.log', 
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '14d', 
      level: 'error', 
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), 
      ),
    }),
  ],
};
