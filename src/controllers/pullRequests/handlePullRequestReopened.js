import handleError from "../handleError.js";
import { messageReopened } from "../../utils/messageTemplates.js";
import logger from "../../logger/logger.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";

const { __filename } = getFilenameAndDirname(import.meta);

async function handlePullRequestReopened({ octokit, payload }) {
    logger.info(
        `Received a pull request event for #${payload.pull_request.number}`
    );
    try {
        await octokit.rest.issues.createComment({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.pull_request.number,
            body: messageReopened,
        });
    } catch (error) {
        handleError(error, {
            source: handlePullRequestReopened.name,
            __filename,
        });
    }
}

export default handlePullRequestReopened;
