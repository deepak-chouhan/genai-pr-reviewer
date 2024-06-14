import ai from "../../ai/ai.js";
import config from "../../config/config.js";
import logger from "../../logger/logger.js";
import generatePrompt from "../../utils/generatePrompt.js";
import handleError from "../handleError.js";

const AGENT_COMMAND = `/${config.agentName}`; // Ex: /cody
const PLATFORM = config.platform;

async function getReviewCommentHistory(
    octokit,
    owner,
    repo,
    pullNumber,
    userId,
    userLogin,
    inReplyToId
) {
    if (!inReplyToId) {
        return [];
    }

    const { data: commentHistory } =
        await octokit.rest.pulls.listReviewComments({
            owner,
            repo,
            pull_number: pullNumber,
        });

    const userCommentHistory = commentHistory.filter(
        (comment) =>
            ((comment.user.id == userId &&
                comment.body.includes(AGENT_COMMAND)) ||
                (comment.body.includes(userLogin) &&
                    comment.user.type === "Bot")) &&
            (comment.id === inReplyToId ||
                comment.in_reply_to_id === inReplyToId)
    );

    return userCommentHistory;
}

async function handleReviewCommentCreated({ octokit, payload }) {
    logger.info(
        `Received a comment event in thread for #${payload.pull_request.number}`
    );

    if (payload.sender.type === "User") {
        console.log(`Got a Comment from User: ${payload.sender.login}`);
        try {
            const owner = payload.repository.owner.login;
            const repo = payload.repository.name;
            const issueNumber = payload.pull_request.number;
            const commentId = payload.comment.id;
            const commentBody = payload.comment.body;
            const diff = payload.comment.diff_hunk;
            const filePath = payload.comment.path;

            const userId = payload.comment.user.id;
            const userLogin = payload.comment.user.login;
            const inReplyToId = payload.comment.in_reply_to_id;

            if (commentBody.trim() === AGENT_COMMAND) {
                const prompt = generatePrompt(
                    {
                        filePath: filePath,
                        hunk: diff,
                        isReviewComment: true,
                    },
                    PLATFORM
                );

                let message = await ai(prompt);

                // Reply to the user who commented
                if (!message.includes(userLogin)) {
                    message = `@${userLogin}\n` + message;
                }

                await octokit.rest.pulls.createReplyForReviewComment({
                    owner,
                    repo,
                    pull_number: issueNumber,
                    comment_id: commentId,
                    body: message,
                });
            }
            // Handle Case when user asks query using `/cody <query>`
            else if (commentBody.includes(AGENT_COMMAND)) {
                // Filter the comments for the thread
                let userCommentHistory;
                if (inReplyToId) {
                    userCommentHistory = await getReviewCommentHistory(
                        octokit,
                        owner,
                        repo,
                        issueNumber,
                        userId,
                        userLogin,
                        inReplyToId
                    );
                } else {
                    userCommentHistory = [payload.comment];
                }

                const prompt = generatePrompt(
                    {
                        hunk: diff,
                        userCommentHistory: userCommentHistory,
                    },
                    PLATFORM
                );

                let message = await ai(prompt);

                // Reply to the user who commented
                if (!message.includes(userLogin)) {
                    message = `@${userLogin}\n` + message;
                }

                await octokit.rest.pulls.createReplyForReviewComment({
                    owner,
                    repo,
                    pull_number: issueNumber,
                    comment_id: commentId,
                    body: message,
                });
            }
        } catch (error) {
            handleError(error);
        }
    } else {
        logger.info(`Got a Comment from Bot: ${payload.sender.login}`);
    }
}

export default handleReviewCommentCreated;
