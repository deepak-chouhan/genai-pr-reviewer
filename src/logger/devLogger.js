import path from "path";

import { createLogger, format, transports } from "winston";
const { colorize, combine, timestamp, printf, errors } = format;

const devFormatte = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const devLogger = (logPath) => {
    return createLogger({
        level: "debug",
        format: combine(
            // colorize(),
            timestamp({ format: "HH:mm:ss" }),
            errors({ stack: true }),
            // devFormatte
            format.json()
        ),
        transports: [
            new transports.File({
                filename: path.join(logPath, "error_dev.log"),
                level: "error",
            }),
            new transports.File({
                filename: path.join(logPath, "all_dev.log"),
            }),
            new transports.Console(),
        ],

        exceptionHandlers: [
            new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
            }),
            new transports.File({
                filename: path.join(logPath, "exceptions_dev.log"),
            }),
        ],
    });
};

export default devLogger;
