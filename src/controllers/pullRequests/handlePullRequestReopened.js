import handleError from "../../utils/handleError.js";
import logger from "../../logger/logger.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";
import { MESSAGE_REOPENED } from "../../utils/messageTemplates.js";

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
            body: MESSAGE_REOPENED,
        });
    } catch (error) {
        handleError(error, {
            source: handlePullRequestReopened.name,
            __filename,
        });
    }
}

export default handlePullRequestReopened;
