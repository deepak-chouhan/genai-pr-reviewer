import config from "../config/config.js";
import logger from "../logger/logger.js";
import chatgpt from "./chatgpt/chatgptService.js";
import gemini from "./gemini/geminiService.js";

async function ai(commentChain) {
    let message;
    logger.info(`Fetching Response from AI, Model: ${config.platform}`);
    if (config.platform === "gemini") {
        message = await gemini(commentChain);
    } else {
        message = await chatgpt(commentChain);
    }

    return message;
}

export default ai;
