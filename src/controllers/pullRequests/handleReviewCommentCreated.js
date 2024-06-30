import ai from "../../ai/ai.js";
import config from "../../config/config.js";
import logger from "../../logger/logger.js";
import generatePrompt from "../../utils/generatePrompt.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";
import handleError from "../../utils/handleError.js";

const { __filename } = getFilenameAndDirname(import.meta);

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

    const loggerObject = {
        userLogin,
        pullNumber: issueNumber,
        repo,
        owner,
        commentId,
        inReplyToId,
    };
    logger.info(`Received a comment event in thread`, loggerObject);

    if (payload.sender.type === "User") {
        logger.info(`Received a Comment from User`, loggerObject);
        try {
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
            handleError(error, {
                source: handleReviewCommentCreated.name,
                __filename,
                loggerObject
            });
        }
    } else {
        logger.info(`Got a Comment from Bot`, loggerObject);
    }
}

export default handleReviewCommentCreated;
