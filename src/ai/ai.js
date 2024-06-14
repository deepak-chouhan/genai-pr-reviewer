import config from "../config/config.js";
import chatgpt from "./chatgpt/chatgptService.js";
import gemini from "./gemini/geminiService.js";

async function ai(commentChain) {
    let message;
    if (config.platform === "gemini") {
        message = await gemini(commentChain);
    } else {
        message = await chatgpt(commentChain);
    }

    return message;
}

export default ai;
