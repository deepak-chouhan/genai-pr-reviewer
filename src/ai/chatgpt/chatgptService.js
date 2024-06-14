import { OpenAI } from "openai";
import config from "../../config/config.js";
import handleError from "../../controllers/handleError.js";

const MODEL = "gpt-3.5-turbo";

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

async function chatgpt(messageChain) {
    let res;
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: messageChain,
            model: MODEL,
        });
        return chatCompletion.choices[0]?.message?.content;
    } catch (error) {
        handleError(error);
        return res;
    }
}

export default chatgpt;
