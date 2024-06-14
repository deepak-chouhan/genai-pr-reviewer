import path from "path";

import { createLogger, format, transports } from "winston";
const { colorize, combine, timestamp, errors } = format;

const devLogger = (logPath) => {
    return createLogger({
        level: "debug",
        format: combine(
            timestamp({ format: "HH:mm:ss" }),
            errors({ stack: true }),
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
                format: format.simple(),
            }),
            new transports.File({
                filename: path.join(logPath, "exceptions_dev.log"),
            }),
        ],
    });
};

export default devLogger;
