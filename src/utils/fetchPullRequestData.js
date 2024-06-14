import handleError from "../controllers/handleError.js";

async function fetchPullReuestData(octokit, owner, repo, pullNumber) {
    try {
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
        handleError(error);
    }
}

export default fetchPullReuestData;
