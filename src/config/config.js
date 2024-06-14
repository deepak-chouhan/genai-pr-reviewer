import dotenv from "dotenv";
import { defaultConfig } from "./default.js";
import { aiConfig } from "./agentConfig.js";
import { environmentConfig } from "./environmentConfig.js";
dotenv.config();

const config = {
    ...defaultConfig,
    ...environmentConfig,
    ...aiConfig,
};

export default config;
