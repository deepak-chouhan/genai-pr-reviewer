import handleError from "../utils/handleError.js";
import handleIssueCommentCreated from "./pullRequests/handleIssueCommentCreated.js";
import handlePullRequestOpened from "./pullRequests/handlePullRequestOpened.js";
import handlePullRequestReopened from "./pullRequests/handlePullRequestReopened.js";
import handleReviewCommentCreated from "./pullRequests/handleReviewCommentCreated.js";

const webhookHandlers = (app) => {
    app.webhooks.on(["pull_request.opened"], handlePullRequestOpened);
    app.webhooks.on(["pull_request.reopened"], handlePullRequestReopened);
    app.webhooks.on(["issue_comment.created"], handleIssueCommentCreated);
    app.webhooks.on(["pull_request_review_comment.created"], handleReviewCommentCreated);
    app.webhooks.onError(handleError);

};

export default webhookHandlers;
