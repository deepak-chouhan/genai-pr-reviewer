import path from "path";

import { createLogger, format, transports } from "winston";
const { colorize, combine, timestamp, printf } = format;

const devFormatte = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const devLogger = (logPath) => {
    return createLogger({
        level: "debug",
        format: combine(
            colorize(),
            timestamp({ format: "HH:mm:ss" }),
            devFormatte
        ),
        transports: [
            new transports.File({
                filename: path.join(logPath, "error_dev.log"),
                level: "error",
            }),
            new transports.File({ filename: path.join(logPath, "all_dev.log") }),
            new transports.Console(),
        ],
    });
};

export default devLogger;
