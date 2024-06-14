import path from "path";

import { createLogger, format, transports } from "winston";
const { combine, timestamp, errors } = format;

const prodLogger = (logPath) => {
    return createLogger({
        level: "error",
        format: combine(timestamp(), errors({ stack: true }), format.json()),
        transports: [
            new transports.File({
                filename: path.join(logPath, "error_prod.log"),
                level: "error",
            }),
            new transports.File({
                filename: path.join(logPath, "all_prod.log"),
            }),
            new transports.Console({
                format: format.combine(format.colorize()),
            }),
        ],
        exceptionHandlers: [
            new transports.File({
                filename: path.join(logPath, "exceptions_prod.log"),
            }),
        ],
    });
};

export default prodLogger;
