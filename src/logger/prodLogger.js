import path from "path";

import { createLogger, format, transports } from "winston";
const { combine, timestamp } = format;

const prodLogger = (logPath) => {
    return createLogger({
        level: "info",
        format: combine(timestamp(), format.json()),
        transports: [
            new transports.File({
                filename: path.join(logPath, "error_prod.log"),
                level: "error",
            }),
            new transports.File({
                filename: path.join(logPath, "all_prod.log"),
            }),
            new transports.Console(),
        ],
    });
};

export default prodLogger;
