import config from "../config/config.js";
import devLogger from "./devLogger.js";
import prodLogger from "./prodLogger.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logPath = path.join(__dirname, "../../logs");

let logger;
if (config.environment === "DEV") {
    logger = devLogger(logPath);
    logger.info("Using Development Logger");
}

if (config.environment === "PROD") {
    logger = prodLogger(logPath);
    logger.info("Using Production Logger");
}

export default logger;
