import handleError from "../../utils/handleError.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../config/config.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";

const { __filename } = getFilenameAndDirname(import.meta);

const MODEL = "gemini-1.5-flash";

const geminiAI = new GoogleGenerativeAI(config.geminiApiKey);

async function gemini(messageChain) {
    let res;
    try {
        const model = geminiAI.getGenerativeModel({ model: MODEL });

        const chatCompletion = model.startChat({
            history: messageChain.slice(0, messageChain.length - 1),
        });

        const result = await chatCompletion.sendMessage(
            messageChain[messageChain.length - 1]["parts"][0]["text"]
        );

        return result.response.text();
    } catch (error) {
        handleError(error, { source: gemini.name, __filename });
        return res;
    }
}

export default gemini;
