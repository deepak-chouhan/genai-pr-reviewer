import logger from "../logger/logger.js";
import generateCommentChain from "./generateCommentChain.js";
import {
    getHunkPrompt,
    getSystemQueryPrompt,
    getSystemReviewComment,
} from "./promptTemplates.js";

export default function generatePrompt(
    {
        userCommentHistory = undefined,
        hunk,
        filePath = undefined,
        isReviewComment = false,
    },
    platform = "openai"
) {
    logger.info(`Generating Prompt isReviewComment: ${isReviewComment}`);
    
    let commentChain;
    if (isReviewComment) {
        const prompt = getHunkPrompt(filePath, hunk, platform);

        commentChain = [getSystemReviewComment(platform), prompt];
    } else {
        commentChain = [
            getSystemQueryPrompt(hunk, platform),
            ...generateCommentChain(userCommentHistory, platform),
        ];
    }

    return commentChain;
}
