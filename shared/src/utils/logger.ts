import { createLogger, format, transports } from 'winston';

export const createSharedLogger = (service: string) => {
    return createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({ stack: true }),
            format.splat(),
            format.json(),
            format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
            format.printf(({ timestamp, level, message, service }) => {
                return `[${timestamp}] [${service}] ${level}: ${message}`;
            })
        ),
        defaultMeta: { service },
        transports: [
            new transports.Console(),
            new transports.File({ 
                filename: `logs/${service}-error.log`, 
                level: 'error' 
            }),
            new transports.File({ 
                filename: `logs/${service}-combined.log` 
            })
        ]
    });
};