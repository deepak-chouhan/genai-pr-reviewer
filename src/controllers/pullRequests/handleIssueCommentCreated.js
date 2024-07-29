import ai from "../../ai/ai.js";
import config from "../../config/config.js";
import logger from "../../logger/logger.js";
import fetchPullReuestData from "../../utils/fetchPullRequestData.js";
import generatePrompt from "../../utils/generatePrompt.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";
import handleError from "../../utils/handleError.js";
import { parsePatch } from "diff";

const { __filename } = getFilenameAndDirname(import.meta);

const AGENT_COMMAND = `/${config.agentName}`; // Ex: /cody
const PLATFORM = config.platform;

async function handleIssueCommentCreated({ octokit, payload }) {
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const issueNumber = payload.issue.number;
    const commentBody = payload.comment.body;
    const userId = payload.comment.user.id;
    const userLogin = payload.comment.user.login;

    const loggerObject = { userLogin, pullNumber: issueNumber, repo, owner };
    logger.info(`Received a Issue Comment Event`, loggerObject);

    if (payload.sender.type !== "User") {
        logger.info(`Recieved a Comment from Bot`, loggerObject);
    }

    logger.info(`Received a Comment from User`, loggerObject);

    try {
        if (commentBody.trim() === AGENT_COMMAND) {
            await handleAgentCommand({
                octokit,
                owner,
                repo,
                issueNumber,
                userLogin,
            });
        } else if (commentBody.includes(AGENT_COMMAND)) {
            await handleAgentMenton({
                octokit,
                owner,
                repo,
                issueNumber,
                userId,
                userLogin,
            });
        }
    } catch (error) {
        handleError(error, {
            source: handleIssueCommentCreated.name,
            __filename,
            loggerObject,
        });
    }
}

async function handleAgentCommand({ octokit, owner, repo, issueNumber, userLogin }) {
    const { pullRequestData, diff } = await fetchPullReuestData(
        octokit,
        owner,
        repo,
        issueNumber
    );

    const patches = parsePatch(diff);
    const reviewCommentPromises = [];
    for (const patch of patches) {
        let position = 0;
        const filePath = patch.newFileName.slice(2);

        for (const hunk of patch.hunks) {
            position += hunk.lines.length;
            const patch = hunk.lines.join("\n");

            const prompt = generatePrompt(
                {
                    hunk: patch,
                    filePath,
                    isReviewComment: true,
                },
                PLATFORM
            );
            let message = await ai(prompt);

            // Reply to the user who commented
            if (!message.includes(userLogin)) {
                message = `@${userLogin}\n` + message;
            }
            reviewCommentPromises.push(
                octokit.rest.pulls.createReviewComment({
                    owner,
                    repo,
                    pull_number: issueNumber,
                    body: message,
                    commit_id: pullRequestData.head.sha,
                    path: filePath,
                    position: position,
                })
            );
        }
    }

    await Promise.all(reviewCommentPromises);
}

async function handleAgentMenton({
    octokit,
    owner,
    repo,
    issueNumber,
    userId,
    userLogin,
}) {
    const { diff } = await fetchPullReuestData(
        octokit,
        owner,
        repo,
        issueNumber
    );

    // Fetch the comment history
    const { data: commentHistory } = await octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
    });

    const userCommentHistory = commentHistory.filter(
        (comment) =>
            (comment.user.id == userId &&
                comment.body.includes(AGENT_COMMAND)) ||
            (comment.body.includes(userLogin) && comment.user.type === "Bot")
    );

    // console.log(diff)
    const prompt = generatePrompt(
        {
            userCommentHistory,
            hunk: diff,
        },
        PLATFORM
    );
    let message = await ai(prompt);

    // Reply to the user who commented
    if (!message.includes(userLogin)) {
        message = `@${userLogin}\n` + message;
    }

    await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: message,
    });
}

export default handleIssueCommentCreated;
