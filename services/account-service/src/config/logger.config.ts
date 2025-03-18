import { createLogger, format, log, transports } from 'winston';

const logger = createLogger({
    level: 'info', // default logging level
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // include error stack if present
        format.splat(),
        format.json() // output logs in JSON format
    ),
    transports: [
        new transports.Console(), // logs to console
        // new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new transports.File({ filename: 'logs/combined.log' })
    ],
});

export default logger;