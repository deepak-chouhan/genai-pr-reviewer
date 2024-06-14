import logger from "../../logger/logger.js";
import handleError from "../../controllers/handleError.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../config/config.js";
import generateCommentChain from "../../utils/generateCommentChain.js";

// TODO: Add Logic for gemini model
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
        console.log("in error");
        handleError(error);
        return res;
    }
}

export default gemini;

// const messages = [
//     {
//         user: {
//             type: "user",
//         },
//         body: "Hello",
//     },
//     {
//         user: {
//             type: "model",
//         },
//         body: "Hello! How are you?",
//     },
//     {
//         user: {
//             type: "user",
//         },
//         body: "Who are you?",
//     },
// ];

// const messageChain = generateCommentChain(messages, "gemini");

// const resp = await gemini(messageChain);

// console.log(resp);

// console.log(messageChain);

// console.log(messageChain.slice(0, messageChain.length - 1));
// console.log(messageChain[messageChain.length - 1]["parts"][0]["text"]);
