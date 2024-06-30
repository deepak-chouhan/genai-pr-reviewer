import handleError from "../../utils/handleError.js";
import logger from "../../logger/logger.js";
import getFilenameAndDirname from "../../utils/getFilenameAndDirname.js";
import { MESSAGE_OPENED } from "../../utils/messageTemplates.js";

const { __filename } = getFilenameAndDirname(import.meta);

async function handlePullRequestOpened({ octokit, payload }) {
    const owner = payload.repository.owner.login;
    const action = payload.action;
    const pullNumber = payload.pull_request.number;
    const userLogin = payload.pull_request.user.login;
    const repo = payload.repository.name;

    const loggerObject = { userLogin, pullNumber, repo, owner, action };

    logger.info(`Received a pull request event`, loggerObject);
    try {
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number: pullNumber,
            body: MESSAGE_OPENED,
        });
    } catch (error) {
        handleError(error, {
            source: handlePullRequestOpened.name,
            __filename,
            loggerObject,
        });
    }
}

export default handlePullRequestOpened;
