import handleError from "../controllers/handleError.js";
import logger from "../logger/logger.js";
import getFilenameAndDirname from "./getFilenameAndDirname.js";

const { __filename } = getFilenameAndDirname(import.meta);

async function fetchPullReuestData(octokit, owner, repo, pullNumber) {
    try {
        logger.info(
            `Fetching Pull Request Data Repo: ${repo} Pull Request No: ${pullNumber}`
        );
        const { data: pullRequestData } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: pullNumber,
        });

        const { data: diff } = await octokit.request(
            `GET /repos/${owner}/${repo}/pulls/${pullNumber}`,
            {
                headers: {
                    accept: "application/vnd.github.v3.diff",
                },
            }
        );

        return {
            pullRequestData,
            diff,
        };
    } catch (error) {
        handleError(error, { source: fetchPullReuestData.name, __filename });
    }
}

export default fetchPullReuestData;
