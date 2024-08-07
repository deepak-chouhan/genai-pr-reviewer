import handleError from "./handleError.js";
import logger from "../logger/logger.js";
import getFilenameAndDirname from "./getFilenameAndDirname.js";

const { __filename } = getFilenameAndDirname(import.meta);

function generateCommentChain(messages, platform = "openai") {
    if (!messages) {
        handleError(
            new Error("Error! Message: messages not valid or undefined"),
            {
                source: generateCommentChain.name,
                __filename,
            }
        );
    }

    let messageChain = [];

    if (platform === "openai") {
        logger.info("Generating Comment Chain", { platform });
        messages.map((message) => {
            const role = message.user.type === "Bot" ? "assistant" : "user";
            const content = message.body;

            messageChain.push({
                role,
                content,
            });
        });
    } else if (platform === "gemini") {
        logger.info("Generating Comment Chain", { platform });
        messages.map((message) => {
            const role = message.user.type === "Bot" ? "model" : "user";
            const parts = [{ text: message.body }];

            messageChain.push({
                role,
                parts,
            });
        });
    }

    return messageChain;
}

export default generateCommentChain;
